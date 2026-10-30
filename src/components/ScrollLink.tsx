"use client";
import { goToSection } from "@/lib/scroll";

export function ScrollLink({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <a className={className} href={`/#${id}`} onClick={(e) => { e.preventDefault(); goToSection(id); }}>
      {children}
    </a>
  );
}
