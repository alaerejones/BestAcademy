import type { Metadata } from "next";
import Link from "next/link";
import { ApplicationStatus } from "@/components/ApplicationStatus";
import { RegisterForm } from "@/components/RegisterForm";
import { SiteShell } from "@/components/SiteShell";
import { loadRegistrationContext } from "@/lib/registration/context";
import { formatMoney } from "@/lib/registration/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Register", description: "Register for The NGO Academy and pay securely online." };

export default async function RegisterPage() {
  const ctx = await loadRegistrationContext();
  const c = ctx.settings?.activeCohort;
  if (ctx.open && !ctx.ready) console.warn("Registration is open in the CMS but not ready: missing fee or PAYSTACK_SECRET_KEY");

  return (
    <SiteShell>
      <section className="section">
        <div className="container reg">
          <div>
            <p className="crumb"><Link href="/">The NGO Academy</Link> / Register</p>
            <h1>Register for The NGO Academy</h1>
            <p className="lead">An 8-week practical programme for NGO founders and leaders, led by Dr. Best Green.</p>
            <h2 className="h3">Before you pay</h2>
            <ul className="rules">
              <li>{c?.name ?? "The current cohort"}{c?.startDate ? `, starts ${new Date(c.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}.</li>
              {c?.deliveryFormat && <li>Delivery: {c.deliveryFormat}</li>}
              {(["individual", "organisation"] as const).map((p) => (ctx.fees[p].NGN || ctx.fees[p].USD) && (
                <li key={p}><strong>{p === "individual" ? "Individual" : "Organisation, three representatives"}:</strong> {[ctx.fees[p].NGN && formatMoney(ctx.fees[p].NGN!, "NGN"), ctx.fees[p].USD && formatMoney(ctx.fees[p].USD!, "USD")].filter(Boolean).join(" or ")}</li>
              ))}
              {c?.confirmedBenefits?.map((b: string) => <li key={b}>{b}</li>)}
              <li>Payment is made on Paystack's secure checkout. Your place is confirmed only when Paystack confirms payment.</li>
            </ul>
            <p className="field__hint">The NGO Playbook is a separate product and is not part of this registration. <a href={ctx.settings?.playbookUrl || "https://nestuge.com/ngoplaybook"} rel="noopener noreferrer">Get it on Nestuge</a>.</p>
          </div>
          <div className="reg__form">
            {ctx.ready ? <RegisterForm fees={ctx.fees} /> : (
              <>
                <ApplicationStatus settings={ctx.settings} id="status" />
                {ctx.open && <p>Online registration is being set up. Please check back shortly{ctx.settings?.contactEmail ? <>, or write to <a href={`mailto:${ctx.settings.contactEmail}`}>{ctx.settings.contactEmail}</a></> : null}.</p>}
              </>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
