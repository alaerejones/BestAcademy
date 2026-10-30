export type Pkg = "individual" | "organisation";
export type Currency = "NGN" | "USD";
export type Fees = Record<Pkg, Partial<Record<Currency, number>>>;

export type CohortFees = {
  priceNgn?: number | null;
  priceUsd?: number | null;
  orgPackagePriceNgn?: number | null;
  orgPackagePriceUsd?: number | null;
};

export type RegistrationInput = {
  fullName: string;
  email: string;
  phone: string;
  organisation: string;
  role: string;
  country: string;
  package: Pkg;
  currency: Currency;
  extraReps: string;
};

const positive = (n?: number | null) => (typeof n === "number" && Number.isFinite(n) && n > 0 ? n : undefined);

export function feesFromCohort(c?: CohortFees | null): Fees {
  return {
    individual: { NGN: positive(c?.priceNgn), USD: positive(c?.priceUsd) },
    organisation: { NGN: positive(c?.orgPackagePriceNgn), USD: positive(c?.orgPackagePriceUsd) },
  };
}

export const hasAnyFee = (f: Fees) => Object.values(f).some((p) => Object.values(p).some(Boolean));
export const toMinor = (amount: number) => Math.round(amount * 100);
export const formatMoney = (amount: number, currency: Currency) =>
  currency === "NGN" ? `₦${amount.toLocaleString("en-NG")}` : `$${amount.toLocaleString("en-US")}`;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9\s-]{6,18}$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

export type Validation = { ok: true; data: RegistrationInput } | { ok: false; errors: Record<string, string> };

export function validateRegistration(raw: unknown): Validation {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const data: RegistrationInput = {
    fullName: clean(r.fullName, 100),
    email: clean(r.email, 120).toLowerCase(),
    phone: clean(r.phone, 20),
    organisation: clean(r.organisation, 120),
    role: clean(r.role, 80),
    country: clean(r.country, 60),
    package: r.package === "organisation" ? "organisation" : "individual",
    currency: r.currency === "USD" ? "USD" : "NGN",
    extraReps: typeof r.extraReps === "string" ? r.extraReps.trim().slice(0, 600) : "",
  };
  const errors: Record<string, string> = {};
  if (data.fullName.length < 2) errors.fullName = "Enter your full name.";
  if (!EMAIL.test(data.email)) errors.email = "Enter a valid email address.";
  if (!PHONE.test(data.phone)) errors.phone = "Enter a valid phone number, for example +234 700 000 0000.";
  if (data.organisation.length < 2) errors.organisation = "Enter your organisation's name, or the one you are building.";
  if (data.role.length < 2) errors.role = "Enter your role.";
  if (data.country.length < 2) errors.country = "Enter your country.";
  if (r.consent !== true) errors.consent = "Please confirm you have read the payment and privacy information.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
