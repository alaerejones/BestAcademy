import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.paystack.co";
type Fetch = typeof fetch;

export type PaystackTx = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  paid_at?: string | null;
  customer?: { email?: string };
  metadata?: Record<string, unknown> | null;
};

async function call<T>(secret: string, path: string, init: RequestInit, f: Fetch): Promise<{ ok: boolean; httpStatus: number; data?: T; message?: string }> {
  try {
    const res = await f(`${API}${path}`, { ...init, headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" }, cache: "no-store" });
    const json = (await res.json().catch(() => null)) as { status?: boolean; message?: string; data?: T } | null;
    return { ok: res.ok && json?.status === true, httpStatus: res.status, data: json?.data, message: json?.message };
  } catch {
    return { ok: false, httpStatus: 0, message: "Could not reach the payment provider." };
  }
}

export function initializeTransaction(secret: string, body: Record<string, unknown>, f: Fetch = fetch) {
  return call<{ authorization_url: string; reference: string }>(secret, "/transaction/initialize", { method: "POST", body: JSON.stringify(body) }, f);
}

export function verifyTransaction(secret: string, reference: string, f: Fetch = fetch) {
  return call<PaystackTx>(secret, `/transaction/verify/${encodeURIComponent(reference)}`, { method: "GET" }, f);
}

export type PaymentState = "paid" | "failed" | "cancelled" | "pending" | "review";

/**
 * Maps a verified Paystack transaction to one of our states.
 * "paid" requires status success AND the amount/currency to match what we asked for at initialisation.
 */
export function classify(tx: PaystackTx): PaymentState {
  switch (tx.status) {
    case "success": {
      const expected = Number(tx.metadata?.expected_amount_minor);
      const expectedCurrency = tx.metadata?.expected_currency;
      return Number.isFinite(expected) && tx.amount === expected && tx.currency === expectedCurrency ? "paid" : "review";
    }
    case "failed":
    case "reversed":
      return "failed";
    case "abandoned":
      return "cancelled";
    default:
      return "pending"; // ongoing, pending, processing, queued
  }
}

export function validSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export const validReference = (r: unknown): r is string => typeof r === "string" && /^[A-Za-z0-9._-]{8,64}$/.test(r);
