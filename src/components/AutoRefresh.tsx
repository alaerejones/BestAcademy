"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function AutoRefresh({ every = 5000, max = 12 }: { every?: number; max?: number }) {
  const router = useRouter();
  const n = useRef(0);
  useEffect(() => {
    const t = setInterval(() => { if (++n.current > max) clearInterval(t); else router.refresh(); }, every);
    return () => clearInterval(t);
  }, [router, every, max]);
  return null;
}

export function PrintButton() {
  return <button className="btn btn--ghost" type="button" onClick={() => window.print()}>Print this confirmation</button>;
}
