# The NGO Academy: setup and progress notes

## Status
Phase 1 complete: scaffold, design tokens, Sanity schemas, application status logic, Studio route.
Sanity credentials NOT wired yet. The site runs on safe fallbacks (status shows "closed").

## Wire Sanity later (about 10 minutes)
1. Create the project: run `npx sanity@latest init --env` or create one at sanity.io/manage. Copy the Project ID.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`. Keep dataset `production`.
3. In sanity.io/manage > API > CORS origins, add `http://localhost:3000` and later the live domain (allow credentials).
4. Run `npm run dev`, open `/studio`, sign in.
5. Create ONE "Site settings" document. Set Application status = closed. Add Playbook URL (https://nestuge.com/ngoplaybook). Add Application URL only once confirmed active.
6. Create a Cohort, tick Published, link it as Active cohort in Site settings.
7. Preview-only: create a Viewer token in API > Tokens and set `SANITY_API_READ_TOKEN` (server only).
8. Deploy: add the same env vars in the host (Vercel). Add a webhook for revalidation in Phase 6.

## Rules baked into the schemas
- Status fails closed: empty, invalid, missing https URL, or past deadline all show "closed".
- Posts need status = published. Phase 8 queries must filter on it.
- Testimonials need approved AND published. Section hides when none exist.
- FAQs stay unpublished until answers are confirmed.
- Week titles stay "proposed" until `curriculumConfirmed` is ticked.
- Contact details live in Site settings (no separate Contact type, to avoid duplicate sources).

## Open confirmations (blockers)
Cohort dates and fees, official curriculum, certificate and recordings, delivery format, NGO registration requirement,
legal entity name, Dr. Best portrait and bio sources, official email and WhatsApp, socials, interest-list tool,
support-link purpose and wording, refund and cookie policy facts.

## Phase map
2 design system, 3 shell and nav, 4 homepage, 5 other pages, 6 Sanity content wiring and preview,
7 status and handoffs, 8 blog, 9 testing.

## Registration and payment (Paystack hosted checkout)
Flow: /register form -> POST /api/register (server validates, takes the price from Sanity, starts Paystack) -> Paystack checkout ->
/register/status (server verifies with Paystack, never trusts the URL) and /api/paystack/webhook (signature checked, then verified again).
States handled: paid, pending (auto-refresh), failed, cancelled, needs review (amount or currency mismatch).

### To go live you must provide
1. PAYSTACK_SECRET_KEY: Paystack dashboard > Settings > API Keys. Start with the TEST key. Never put it in frontend code.
2. In Paystack dashboard > Settings > API Keys & Webhooks, set the Webhook URL to https://YOUR-DOMAIN/api/paystack/webhook
3. NEXT_PUBLIC_SITE_URL set to the live domain (used for the return and cancel links).
4. Confirmed cohort fees in Sanity (cohort: priceNgn, priceUsd, orgPackagePriceNgn, orgPackagePriceUsd). Leave a field empty to hide that option.
5. USD: only works if your Paystack account is enabled for USD. Otherwise leave the USD fields empty.
6. Site settings: Application status = open, Active cohort linked and Published. Leave Application URL and the cohort's external URL EMPTY.
7. SANITY_API_WRITE_TOKEN (Editor token) so paid registrations are stored as private "registration" documents. Without it, Paystack's dashboard is the record.
8. Confirm the Academy is happy with Paystack's terms, then update privacy, terms and refund pages (Phase 5) before launch.

### Test before launch
`npm test` runs the payment-logic tests. With a Paystack TEST key, use Paystack's test cards on /register to see success, failed and cancelled.
