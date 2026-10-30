import { cache } from "react";
import { safeFetch } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import type { StatusSettings } from "@/components/ApplicationStatus";

export type Cohort = { _id?: string; name?: string; startDate?: string; deadline?: string; priceNgn?: number; priceUsd?: number; orgPackagePriceNgn?: number; orgPackagePriceUsd?: number; deliveryFormat?: string; registrationUrl?: string; confirmedBenefits?: string[] };
export type Settings = NonNullable<StatusSettings> & {
  playbookUrl?: string; supportUrl?: string; contactEmail?: string; whatsappNumber?: string; organisationName?: string;
  socialLinks?: { platform: string; url: string }[]; activeCohort?: Cohort;
};
export const getSettings = cache(() => safeFetch<Settings | null>(siteSettingsQuery));
