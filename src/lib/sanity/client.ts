import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "./env";

export const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

/** Fetch helper that never throws. Returns null when Sanity is not configured or the request fails. */
export async function safeFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: 60, tags: ["sanity"] } });
  } catch (error) {
    console.error("Sanity fetch failed", error);
    return null;
  }
}
