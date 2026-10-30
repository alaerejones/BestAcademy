"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { goToSection } from "@/lib/scroll";

const items = [["About", "about"], ["Programme", "programme"], ["Facilitator", "facilitator"], ["Playbook", "playbook"], ["FAQs", "faqs"]] as const;

export function SiteHeader({ cta }: { cta: { label: string; href: string; external: boolean } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    if (pathname !== "/") { setActive(null); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { const s = (e.target as HTMLElement).dataset.spy; setActive(s && s !== "top" ? s : null); } }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-spy]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const jump = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); goToSection(id); };

  return (
    <header className="header on-navy">
      <div className="container header__bar">
        <Link className="brand" href="/" onClick={(e) => { if (pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); window.history.replaceState(null, "", "/"); } }}>
          <span>The</span> NGO <span className="brand__accent">Academy</span>
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
        <nav id="primary-nav" aria-label="Primary" className="nav" data-open={open}>
          <ul>
            {items.map(([label, id]) => (
              <li key={id}><a href={`/#${id}`} onClick={jump(id)} aria-current={active === id ? "location" : undefined}>{label}</a></li>
            ))}
          </ul>
          {cta.href.startsWith("#")
            ? <a className="btn btn--accent" href={`/${cta.href}`} onClick={jump(cta.href.slice(1))}>{cta.label}</a>
            : cta.external
              ? <a className="btn btn--accent" href={cta.href} rel="noopener noreferrer">{cta.label}</a>
              : <Link className="btn btn--accent" href={cta.href}>{cta.label}</Link>}
        </nav>
      </div>
    </header>
  );
}
