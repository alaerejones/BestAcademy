import Image from "next/image";
import Link from "next/link";
import { ScrollLink } from "./ScrollLink";

type Settings = { organisationName?: string | null; contactEmail?: string | null; whatsappNumber?: string | null; supportUrl?: string | null; socialLinks?: { platform: string; url: string }[] | null } | null;

export function SiteFooter({ settings, playbookUrl }: { settings: Settings; playbookUrl: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer on-navy">
      <div className="container footer__grid">
        <div>
          <p className="footer__brand">The NGO <span className="brand__accent">Academy</span></p>
          <p>Practical learning for NGO founders and leaders building organisations that work, attract funding and sustain impact.</p>
        </div>
        <nav aria-label="Explore"><h2 className="footer__h">Explore</h2>
          <ul>
            <li><ScrollLink id="about">About</ScrollLink></li>
            <li><ScrollLink id="programme">The programme</ScrollLink></li>
            <li><ScrollLink id="facilitator">Meet Dr. Best</ScrollLink></li>
            <li><ScrollLink id="faqs">FAQs</ScrollLink></li>
          </ul></nav>
        <nav aria-label="Take action"><h2 className="footer__h">Take action</h2>
          <ul>
            <li><Link href="/register">Register</Link></li>
            <li><a href={playbookUrl} rel="noopener noreferrer">Get The NGO Playbook</a></li>
            {settings?.supportUrl && <li><a href={settings.supportUrl} rel="noopener noreferrer">Support the mission</a></li>}
          </ul></nav>
        <div><h2 className="footer__h">Contact</h2>
          <ul>
            {settings?.contactEmail && <li><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></li>}
            {settings?.whatsappNumber && <li>WhatsApp: {settings.whatsappNumber}</li>}
            {settings?.socialLinks?.map((s) => (<li key={s.url}><a href={s.url} rel="noopener noreferrer">{s.platform}</a></li>))}
            {!settings?.contactEmail && !settings?.whatsappNumber && <li>Contact details are published here once confirmed.</li>}
          </ul></div>
      </div>
      <div className="container footer__base">
        <p className="footer__partner"><span>In association with</span> <span className="logo-tile"><Image src="/images/lend-wings-logo.png" alt="Lend Wings Consulting" width={385} height={197} /></span></p>
        <p>© {year} The NGO Academy. All rights reserved.</p>
        <p>Website built by Creit Technologies.</p>
      </div>
    </footer>
  );
}
