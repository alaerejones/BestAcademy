import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { classify, validSignature, validReference, type PaystackTx } from "../src/lib/registration/paystack";
import { feesFromCohort, validateRegistration } from "../src/lib/registration/types";
import { startRegistration, type RegistrationContext } from "../src/lib/registration/service";
import { resolveApplication } from "../src/lib/status";

const good = { fullName: "Ada Obi", email: "ADA@Example.org", phone: "+234 700 000 0000", organisation: "Hope Initiative", role: "Founder", country: "Nigeria", package: "individual", currency: "NGN", consent: true };
const ctx = (o: Partial<RegistrationContext> = {}): RegistrationContext => ({ open: true, secret: "sk_test_x", siteUrl: "https://site.test", fees: feesFromCohort({ priceNgn: 100000, priceUsd: 80, orgPackagePriceNgn: 250000 }), ...o });
const tx = (o: Partial<PaystackTx> = {}): PaystackTx => ({ status: "success", reference: "R", amount: 10000000, currency: "NGN", metadata: { expected_amount_minor: 10000000, expected_currency: "NGN" }, ...o });
const fakeFetch = (body: unknown, ok = true) => (async () => new Response(JSON.stringify(body), { status: ok ? 200 : 400 })) as unknown as typeof fetch;

test("classify: every payment state", () => {
  assert.equal(classify(tx()), "paid");
  assert.equal(classify(tx({ amount: 5 })), "review");            // underpaid
  assert.equal(classify(tx({ currency: "USD" })), "review");      // wrong currency
  assert.equal(classify(tx({ metadata: {} })), "review");         // no expectation recorded
  assert.equal(classify(tx({ status: "failed" })), "failed");
  assert.equal(classify(tx({ status: "reversed" })), "failed");
  assert.equal(classify(tx({ status: "abandoned" })), "cancelled");
  for (const s of ["ongoing", "pending", "processing", "queued"]) assert.equal(classify(tx({ status: s })), "pending");
});

test("webhook signature", () => {
  const body = '{"event":"charge.success"}';
  const sig = createHmac("sha512", "sk").update(body).digest("hex");
  assert.ok(validSignature(body, sig, "sk"));
  assert.ok(!validSignature(body, sig, "other"));
  assert.ok(!validSignature(body + " ", sig, "sk"));
  assert.ok(!validSignature(body, null, "sk"));
});

test("reference format", () => { assert.ok(validReference("NGOA-ABC123-DEADBEEF")); assert.ok(!validReference("../etc")); assert.ok(!validReference("x")); });

test("validation", () => {
  assert.ok(validateRegistration(good).ok);
  const bad = validateRegistration({ ...good, email: "nope", consent: false, fullName: "" });
  assert.ok(!bad.ok && bad.errors.email && bad.errors.consent && bad.errors.fullName);
});

test("start: price comes from server, browser amount ignored", async () => {
  let sent: any;
  const f = (async (_u: string, init: RequestInit) => { sent = JSON.parse(String(init.body)); return new Response(JSON.stringify({ status: true, data: { authorization_url: "https://checkout.paystack.com/x", reference: sent.reference } })); }) as unknown as typeof fetch;
  const r = await startRegistration({ ...good, amount: 1 }, ctx(), { fetch: f });
  assert.ok(r.ok);
  assert.equal(sent.amount, 10000000);
  assert.equal(sent.currency, "NGN");
  assert.equal(sent.email, "ada@example.org");
  assert.equal(sent.metadata.expected_amount_minor, 10000000);
});

test("start: refuses when closed, unconfigured, invalid, unavailable fee, honeypot, provider failure", async () => {
  const f = fakeFetch({ status: true, data: { authorization_url: "u", reference: "r" } });
  assert.equal((await startRegistration(good, ctx({ open: false }), { fetch: f }) as any).status, 409);
  assert.equal((await startRegistration(good, ctx({ secret: null }), { fetch: f }) as any).status, 503);
  assert.equal((await startRegistration({ ...good, email: "x" }, ctx(), { fetch: f }) as any).status, 422);
  assert.equal((await startRegistration({ ...good, package: "organisation", currency: "USD" }, ctx(), { fetch: f }) as any).status, 422);
  assert.equal((await startRegistration({ ...good, companySite: "spam" }, ctx(), { fetch: f }) as any).status, 400);
  assert.equal((await startRegistration(good, ctx(), { fetch: fakeFetch({ status: false, message: "no" }, false) }) as any).status, 502);
});

test("application status fails closed", () => {
  assert.equal(resolveApplication(null).status, "closed");
  assert.equal(resolveApplication({ applicationStatus: "open" }).status, "open");
  assert.equal(resolveApplication({ applicationStatus: "open", activeCohort: { deadline: "2000-01-01T00:00:00Z" } }).status, "closed");
  assert.equal(resolveApplication({ applicationStatus: "garbage" }).status, "closed");
  assert.equal(resolveApplication({ applicationStatus: "open", applicationUrl: "http://insecure.test" }).registrationUrl, "/register");
});
