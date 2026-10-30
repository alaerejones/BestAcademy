export type ApplicationStatus = "open" | "closed" | "coming_soon";
export const REGISTER_PATH = "/register";

export type SettingsForStatus = {
  applicationStatus?: string | null;
  applicationUrl?: string | null;
  activeCohort?: { registrationUrl?: string | null; deadline?: string | null } | null;
} | null;

function isHttpsUrl(value?: string | null): value is string {
  if (!value) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

/**
 * Single source of truth for application status. Fails closed.
 * "open" needs status = open and a deadline that has not passed.
 * Registration happens on this website (/register). A valid https URL in the CMS is
 * only used if the Academy deliberately sets one as an external override.
 */
export function resolveApplication(settings: SettingsForStatus, now = new Date()): {
  status: ApplicationStatus;
  registrationUrl: string | null;
} {
  if (!settings) return { status: "closed", registrationUrl: null };
  const raw = settings.applicationStatus;
  if (raw === "coming_soon") return { status: "coming_soon", registrationUrl: null };
  if (raw !== "open") return { status: "closed", registrationUrl: null };

  const deadline = settings.activeCohort?.deadline;
  if (deadline && new Date(deadline).getTime() < now.getTime()) return { status: "closed", registrationUrl: null };

  const override = settings.activeCohort?.registrationUrl || settings.applicationUrl;
  return { status: "open", registrationUrl: isHttpsUrl(override) ? override : REGISTER_PATH };
}
