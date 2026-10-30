import { NextResponse } from "next/server";
import { loadRegistrationContext } from "@/lib/registration/context";
import { recordInitiated } from "@/lib/registration/store";
import { startRegistration } from "@/lib/registration/service";

const hits = new Map<string, number[]>(); // best-effort limiter; use an edge/WAF limit in production

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 6) return NextResponse.json({ ok: false, message: "Too many attempts. Please wait a minute and try again." }, { status: 429 });
  hits.set(ip, [...recent, now]);

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 }); }

  const ctx = await loadRegistrationContext();
  const result = await startRegistration(body, ctx, { recordInitiated });
  return NextResponse.json(result, { status: result.ok ? 200 : result.status });
}
