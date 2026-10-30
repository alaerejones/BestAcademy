import { NextResponse } from "next/server";
import { classify, validSignature, verifyTransaction } from "@/lib/registration/paystack";
import { recordOutcome } from "@/lib/registration/store";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await req.text(); // signature is computed over the exact raw body
  if (!validSignature(raw, req.headers.get("x-paystack-signature"), secret)) return NextResponse.json({ ok: false }, { status: 401 });

  let event: { event?: string; data?: { reference?: string } };
  try { event = JSON.parse(raw); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const reference = event.data?.reference;
  if (reference && (event.event === "charge.success" || event.event === "charge.failed")) {
    // Never trust the webhook body for status: confirm with Paystack's verify endpoint.
    const v = await verifyTransaction(secret, reference);
    if (v.ok && v.data) {
      const state = classify(v.data);
      await recordOutcome(reference, { status: state, paidAt: state === "paid" ? v.data.paid_at ?? new Date().toISOString() : null, amountMinor: v.data.amount, currency: v.data.currency });
    }
  }
  return NextResponse.json({ ok: true });
}
