import Link from "next/link";
import { resolveApplication, type SettingsForStatus } from "@/lib/status";

export type StatusSettings = (SettingsForStatus & { interestListUrl?: string | null }) | null;

const COPY = {
  open: { icon: "●", label: "Application is on", body: "Registration for the next cohort is open. Register and pay securely on this website." },
  closed: { icon: "■", label: "Application closed", body: "The next one will be announced here, join the waitlist to get notified." },
  coming_soon: { icon: "◆", label: "Applications opening soon", body: "The next cohort is being prepared." },
} as const;

export function getStatusView(settings: StatusSettings) {
  const { status, registrationUrl } = resolveApplication(settings);
  if (status === "open" && registrationUrl) {
    return { status, href: registrationUrl, cta: "Register now", external: registrationUrl.startsWith("http") };
  }
  const interest = settings?.interestListUrl ?? null;
  return { status, href: interest ?? "#status", cta: interest ? "Join the interest list" : "Application status", external: Boolean(interest) };
}

export function ApplicationStatus({ settings, id = "status" }: { settings: StatusSettings; id?: string }) {
  const v = getStatusView(settings);
  const c = COPY[v.status];
  const showCta = v.status === "open" || v.external;
  return (
    <div id={id} className={`status status--${v.status}`}>
      <p className="status__label" role="status"><span aria-hidden="true">{c.icon}</span> {c.label}</p>
      <p className="status__body">{c.body}</p>
      {showCta && (v.external
        ? <a className="btn btn--primary" href={v.href} rel="noopener noreferrer">{v.cta}</a>
        : <Link className="btn btn--primary" href={v.href}>{v.cta}</Link>)}
    </div>
  );
}
