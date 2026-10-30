export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-10-01";

/** True only when a project ID has been supplied. Until then the site runs on safe fallbacks. */
export const sanityConfigured = projectId.length > 0;
