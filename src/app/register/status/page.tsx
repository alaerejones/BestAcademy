import type { Metadata } from "next";
import Link from "next/link";
import { AutoRefresh, PrintButton } from "@/components/AutoRefresh";
import { SiteShell } from "@/components/SiteShell";
import { classify, validReference, verifyTransaction } from "@/lib/registration/paystack";
import { recordOutcome } from "@/lib/registration/store";
import { formatMoney, type Currency } from "@/lib/registration/types";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Payment status", robots: { index: false, follow: false } };

export default async function StatusPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ref = [sp.reference, sp.trxref].flat().find(validReference);
  const settings = await getSettings();
  const secret = process.env.PAYSTACK_SECRET_KEY;

  let state: "paid" | "failed" | "cancelled" | "pending" | "review" | "unknown" | "noref" = "noref";
  let tx;
  if (ref && secret) {
    const v = await verifyTransaction(secret, ref); // the URL is never trusted; Paystack decides
    if (v.ok && v.data) {
      tx = v.data; state = classify(tx);
      if (state === "paid" || state === "failed" || state === "cancelled") await recordOutcome(ref, { status: state, paidAt: state === "paid" ? tx.paid_at ?? new Date().toISOString() : null, amountMinor: tx.amount, currency: tx.currency });
    } else state = "unknown";
  } else if (ref) state = "unknown";

  const meta = (tx?.metadata ?? {}) as { fullName?: string; packageLabel?: string; cohort?: string };
  const contact = settings?.contactEmail ? <> Contact <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a> and quote reference <strong>{ref}</strong>.</> : <> Quote reference <strong>{ref}</strong> when you contact the Academy.</>;

  return (
    <SiteShell>
      <section className="section"><div className="container narrow status-page">
        {state === "paid" && tx && (<>
          <p className="status__label" role="status"><span aria-hidden="true">●</span> Payment confirmed</p>
          <h1>You are registered{meta.fullName ? `, ${meta.fullName.split(" ")[0]}` : ""}.</h1>
          <p className="lead">Paystack has confirmed your payment for The NGO Academy.</p>
          <dl className="receipt">
            <div><dt>Reference</dt><dd>{ref}</dd></div>
            {meta.packageLabel && <div><dt>Package</dt><dd>{meta.packageLabel}</dd></div>}
            {meta.cohort && <div><dt>Cohort</dt><dd>{meta.cohort}</dd></div>}
            <div><dt>Amount paid</dt><dd>{formatMoney(tx.amount / 100, tx.currency as Currency)}</dd></div>
            {tx.customer?.email && <div><dt>Email</dt><dd>{tx.customer.email}</dd></div>}
            {tx.paid_at && <div><dt>Paid</dt><dd>{new Date(tx.paid_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}</dd></div>}
          </dl>
          <p>Keep this reference. Paystack may also email a payment receipt to the address above.{contact}</p>
          <div className="actions"><Link className="btn btn--primary" href="/">Back to the Academy</Link><PrintButton /></div>
        </>)}
        {state === "pending" && (<><AutoRefresh />
          <p className="status__label" role="status"><span aria-hidden="true">◆</span> Payment pending</p>
          <h1>We are waiting for confirmation.</h1>
          <p className="lead">Your payment has not been confirmed yet. This page checks again automatically. Please do not pay twice.</p>
          <p>If this stays pending, quote reference <strong>{ref}</strong> to the Academy.</p></>)}
        {state === "cancelled" && (<><p className="status__label" role="status"><span aria-hidden="true">■</span> Payment cancelled</p>
          <h1>No payment was made.</h1><p className="lead">You left checkout before paying, so nothing was charged and you are not registered yet.</p>
          <Link className="btn btn--primary" href="/register">Try again</Link></>)}
        {state === "failed" && (<><p className="status__label" role="status"><span aria-hidden="true">■</span> Payment failed</p>
          <h1>The payment did not go through.</h1><p className="lead">You are not registered yet. If your bank shows a debit, it is usually returned automatically.{contact}</p>
          <Link className="btn btn--primary" href="/register">Try again</Link></>)}
        {state === "review" && (<><p className="status__label" role="status"><span aria-hidden="true">◆</span> Needs review</p>
          <h1>We need to check this payment.</h1><p className="lead">The amount received does not match the registration. Your registration is not confirmed until this is reviewed.{contact}</p></>)}
        {(state === "unknown" || state === "noref") && (<><p className="status__label" role="status"><span aria-hidden="true">◆</span> Status unavailable</p>
          <h1>{state === "noref" ? "No payment reference found." : "We could not confirm this payment yet."}</h1>
          <p className="lead">{state === "noref" ? "Open this page from the link Paystack sends you back to after checkout." : "Please refresh in a moment."}{ref ? contact : null}</p>
          <Link className="btn btn--primary" href="/register">Go to registration</Link></>)}
      </div></section>
    </SiteShell>
  );
}
