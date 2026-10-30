"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cleanUrl, scrollToId } from "@/lib/scroll";

/** Scroll reveals, plus clean-URL handling for arrivals that carry a #hash or a pending nav target. */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (reduce) { els.forEach((el) => el.classList.add("in")); return; }
    root.dataset.motion = "on";
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const target = sessionStorage.getItem("nav-target") || window.location.hash.slice(1);
    sessionStorage.removeItem("nav-target");
    if (!target) return;
    const t = window.setTimeout(() => { if (!scrollToId(target)) cleanUrl(); }, 60);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return <div className="progress" aria-hidden="true" />;
}
