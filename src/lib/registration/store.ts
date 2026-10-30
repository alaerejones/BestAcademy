import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/lib/sanity/env";

/** Server-only. Uses a write token that must never be prefixed NEXT_PUBLIC_. */
function writer() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId) return null;
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}

// A dot in the document id keeps the record private: it is not returned by public queries.
const idFor = (reference: string) => `registration.${reference}`;

export async function recordInitiated(doc: Record<string, unknown> & { reference: string }) {
  const c = writer();
  if (!c) return false;
  try {
    await c.createIfNotExists({ _id: idFor(doc.reference), _type: "registration", status: "initiated", ...doc });
    return true;
  } catch (e) {
    console.error("Registration record failed", e);
    return false;
  }
}

export async function recordOutcome(reference: string, patch: { status: string; paidAt?: string | null; amountMinor?: number; currency?: string }) {
  const c = writer();
  if (!c) return false;
  try {
    await c.patch(idFor(reference)).set(patch).commit({ returnDocuments: false });
    return true;
  } catch (e) {
    console.error("Registration update failed", e);
    return false;
  }
}
