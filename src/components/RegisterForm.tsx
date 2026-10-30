"use client";
import { useRef, useState } from "react";
import type { Currency, Fees, Pkg } from "@/lib/registration/types";
import { formatMoney } from "@/lib/registration/types";

const FIELDS = [
  ["fullName", "Full name", "name", "text"], ["email", "Email address", "email", "email"], ["phone", "Phone number", "tel", "tel"],
  ["organisation", "Organisation", "organization", "text"], ["role", "Your role", "organization-title", "text"], ["country", "Country", "country-name", "text"],
] as const;

export function RegisterForm({ fees }: { fees: Fees }) {
  const pkgs = (["individual", "organisation"] as Pkg[]).filter((p) => fees[p].NGN || fees[p].USD);
  const [pkg, setPkg] = useState<Pkg>(pkgs[0]);
  const curs = (["NGN", "USD"] as Currency[]).filter((c) => fees[pkg][c]);
  const [cur, setCur] = useState<Currency>(curs[0]);
  const currency = curs.includes(cur) ? cur : curs[0];
  const amount = fees[pkg][currency]!;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const summary = useRef<HTMLDivElement>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = { ...Object.fromEntries(fd.entries()), package: pkg, currency, consent: fd.get("consent") === "on" };
    setBusy(true); setErrors({}); setFormError("");
    try {
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (json.ok && json.authorizationUrl) { window.location.assign(json.authorizationUrl); return; }
      setErrors(json.errors ?? {}); setFormError(json.message ?? "Something went wrong. Nothing has been charged.");
    } catch { setFormError("We could not reach the server. Check your connection and try again. Nothing has been charged."); }
    setBusy(false);
    setTimeout(() => summary.current?.focus(), 0);
  }

  const err = (k: string) => (errors[k] ? <p className="field__error" id={`${k}-err`}>⚠ {errors[k]}</p> : null);
  const bad = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <form className="form" onSubmit={submit} noValidate>
      {(formError || Object.keys(errors).length > 0) && (
        <div className="form__alert" role="alert" tabIndex={-1} ref={summary}>
          <strong>{formError || "Please correct the highlighted fields."}</strong>
          <ul>{Object.entries(errors).map(([k, m]) => <li key={k}><a href={`#${k}`}>{m}</a></li>)}</ul>
        </div>
      )}
      {FIELDS.map(([k, label, ac, type]) => (
        <div className="field" key={k}>
          <label htmlFor={k}>{label}</label>
          <input id={k} name={k} type={type} autoComplete={ac} required maxLength={120} {...bad(k)} />
          {err(k)}
        </div>
      ))}

      {pkgs.length > 1 && (
        <fieldset className="choice"><legend>Package</legend>
          {pkgs.map((p) => (
            <label key={p}><input type="radio" name="pkg" checked={pkg === p} onChange={() => setPkg(p)} /> {p === "individual" ? "Individual" : "Organisation (three representatives)"}</label>
          ))}
        </fieldset>
      )}
      {curs.length > 1 && (
        <fieldset className="choice"><legend>Pay in</legend>
          {curs.map((c) => (<label key={c}><input type="radio" name="cur" checked={currency === c} onChange={() => setCur(c)} /> {c === "NGN" ? "Naira (₦)" : "US dollars ($)"}</label>))}
        </fieldset>
      )}
      {pkg === "organisation" && (
        <div className="field">
          <label htmlFor="extraReps">Other two representatives (optional)</label>
          <textarea id="extraReps" name="extraReps" rows={3} maxLength={600} placeholder="Names and email addresses" />
          <p className="field__hint">You can also send these later.</p>
        </div>
      )}

      <div className="field hp" aria-hidden="true"><label htmlFor="companySite">Leave this empty</label><input id="companySite" name="companySite" tabIndex={-1} autoComplete="off" /></div>

      <div className="field">
        <label className="check"><input type="checkbox" name="consent" {...bad("consent")} /> I understand that payment is made on Paystack, that my place is confirmed only once payment is confirmed, and I have read how my details are used.</label>
        {err("consent")}
      </div>

      <p className="total" aria-live="polite">Total to pay: <strong>{formatMoney(amount, currency)}</strong></p>
      <button className="btn btn--primary btn--block" type="submit" disabled={busy}>{busy ? "Starting secure checkout…" : "Continue to secure payment"}</button>
      <p className="field__hint">You will be redirected to Paystack. Card details are entered there only.</p>
    </form>
  );
}
