import "server-only";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { resolveApplication } from "@/lib/status";
import { feesFromCohort, hasAnyFee } from "./types";
import type { RegistrationContext } from "./service";

export type ServerSettings = Record<string, any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Always reads fresh settings (no CDN) so fees and status are never stale when money is involved. */
export async function loadRegistrationContext(): Promise<RegistrationContext & { settings: ServerSettings; ready: boolean }> {
  let settings: ServerSettings = null;
  if (client) {
    try { settings = await client.withConfig({ useCdn: false }).fetch(siteSettingsQuery, {}, { cache: "no-store" }); }
    catch (e) { console.error("Settings fetch failed", e); }
  }
  const { status } = resolveApplication(settings);
  const fees = feesFromCohort(settings?.activeCohort);
  const secret = process.env.PAYSTACK_SECRET_KEY || null;
  const open = status === "open";
  return {
    open, fees, secret, settings,
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
    cohortId: settings?.activeCohort?._id,
    cohortName: settings?.activeCohort?.name,
    ready: open && hasAnyFee(fees) && Boolean(secret),
  };
}
