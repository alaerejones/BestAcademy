import { randomBytes } from "node:crypto";
import { formatMoney, toMinor, validateRegistration, type Fees } from "./types";
import { initializeTransaction } from "./paystack";

export type RegistrationContext = {
  open: boolean;
  fees: Fees;
  secret: string | null;
  siteUrl: string;
  cohortId?: string;
  cohortName?: string;
};

export type StartResult =
  | { ok: true; authorizationUrl: string; reference: string }
  | { ok: false; status: number; message: string; errors?: Record<string, string> };

type Deps = {
  fetch?: typeof fetch;
  recordInitiated?: (doc: Record<string, unknown> & { reference: string }) => Promise<unknown>;
};

export const newReference = () => `NGOA-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString("hex").toUpperCase()}`;

export async function startRegistration(raw: unknown, ctx: RegistrationContext, deps: Deps = {}): Promise<StartResult> {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  if (typeof r.companySite === "string" && r.companySite.length > 0) return { ok: false, status: 400, message: "Request rejected." }; // honeypot

  if (!ctx.open) return { ok: false, status: 409, message: "Registration is not open." };
  if (!ctx.secret) return { ok: false, status: 503, message: "Online payment is not available yet." };

  const v = validateRegistration(raw);
  if (!v.ok) return { ok: false, status: 422, message: "Please correct the highlighted fields.", errors: v.errors };

  const d = v.data;
  const amount = ctx.fees[d.package][d.currency]; // price always comes from the server, never the browser
  if (!amount) return { ok: false, status: 422, message: "That fee option is not available.", errors: { package: "That fee option is not available for this cohort." } };

  const reference = newReference();
  const amountMinor = toMinor(amount);
  const label = d.package === "organisation" ? "Organisation package (three representatives)" : "Individual";

  const res = await initializeTransaction(ctx.secret, {
    email: d.email,
    amount: amountMinor,
    currency: d.currency,
    reference,
    callback_url: `${ctx.siteUrl}/register/status`,
    metadata: {
      cancel_action: `${ctx.siteUrl}/register/status?reference=${reference}&cancelled=1`,
      expected_amount_minor: amountMinor,
      expected_currency: d.currency,
      fullName: d.fullName,
      package: d.package,
      packageLabel: label,
      cohort: ctx.cohortName ?? null,
      custom_fields: [
        { display_name: "Name", variable_name: "name", value: d.fullName },
        { display_name: "Phone", variable_name: "phone", value: d.phone },
        { display_name: "Organisation", variable_name: "organisation", value: d.organisation },
        { display_name: "Package", variable_name: "package", value: label },
      ],
    },
  }, deps.fetch);

  if (!res.ok || !res.data?.authorization_url) {
    console.error("Paystack initialise failed", res.httpStatus, res.message);
    return { ok: false, status: 502, message: "We could not start the payment. Nothing has been charged. Please try again." };
  }

  await deps.recordInitiated?.({
    reference, status: "initiated", fullName: d.fullName, email: d.email, phone: d.phone, organisation: d.organisation,
    role: d.role, country: d.country, package: d.package, currency: d.currency, amountMinor, extraRepresentatives: d.extraReps || undefined,
    cohort: ctx.cohortId ? { _type: "reference", _ref: ctx.cohortId } : undefined,
    summary: `${label}, ${formatMoney(amount, d.currency)}`,
  });
  return { ok: true, authorizationUrl: res.data.authorization_url, reference };
}
