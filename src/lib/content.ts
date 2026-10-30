export const PLAYBOOK_FALLBACK_URL = "https://nestuge.com/ngoplaybook";

export const areas = [
  ["Strategy", "Clarify where your organisation is going, why it exists and how its activities connect to its larger goals."],
  ["Governance", "Understand the structures, responsibilities and accountability systems required to build an organisation that is not dependent on one person."],
  ["Programmes", "Move from ideas and activities to programmes that are clearly designed, relevant and connected to your organisation's purpose."],
  ["Funding systems", "Build a funding approach instead of depending on one donor, one grant or random opportunities."],
  ["Grant readiness", "Learn what makes an organisation and its projects more prepared for grant opportunities."],
  ["Financial management", "Build better systems for planning, managing and accounting for organisational resources."],
  ["Impact measurement", "Define, track and communicate what your organisation is actually achieving."],
  ["Sustainability", "Bring the parts together to build an organisation that continues beyond individual projects, founders or funding cycles."],
] as const;

export const needs = ["Clear strategy", "Good governance", "Strong programmes", "Funding systems", "Financial discipline", "Grant readiness", "Measurable results", "Organisational systems", "A plan for sustainability"];

export const audience = ["NGO founders", "NGO leaders", "Executive directors", "Programme managers", "Social impact leaders", "Nonprofit professionals", "Community-based organisation leaders", "People building or restructuring an NGO"];

export const mayBe = [
  "You have registered an NGO but are unsure what to do next.",
  "You have a strong mission but lack a clear organisational structure.",
  "You have applied for grants but have not had the results you expected.",
  "Your organisation depends heavily on one donor or one source of income.",
  "You run projects but struggle to document and communicate results.",
  "Too many things depend on you as the founder.",
];

export const mayNot = [
  "You are looking for a quick grant.",
  "You expect the Academy to write grant applications for you.",
  "You want a certificate without doing the work.",
  "You are looking for a programme focused only on registering an NGO.",
];

export const steps = [
  ["Check the application status", "Registration opens for specific cohorts. This website always shows the current status."],
  ["Register", "When registration is open, complete a short form on this website. We ask only for what we need to register you."],
  ["Pay securely", "You are taken to Paystack's hosted checkout. Card details are entered there and never reach this website."],
  ["Get confirmed", "Your place is confirmed only when Paystack confirms the payment. You then see a confirmation page with your reference."],
] as const;

export const faqs = [
  ["What is The NGO Academy?", "An 8-week practical programme for NGO founders and leaders who want to strengthen their organisations across strategy, governance, programmes, funding, grant readiness, financial management, impact measurement and sustainability."],
  ["Who can join?", "The programme is designed primarily for NGO founders, leaders and nonprofit professionals."],
  ["How long is the programme?", "The published programme is 8 weeks."],
  ["When does the next cohort start?", "The next cohort date is announced when applications open."],
  ["How much does it cost?", "Fees are shown for the current cohort and may change between cohorts."],
  ["How do I apply?", "When registration is open, select Register, complete the short form and pay securely online."],
  ["Where does payment happen?", "Payment is made on Paystack's secure hosted checkout after you register. This website never sees or stores your card details."],
  ["Can I attend from outside Nigeria?", "The current public promotion states that participants can join from anywhere."],
  ["Is The NGO Playbook included in the Academy?", "No. The NGO Playbook is a separate product."],
  ["Can I buy the Playbook without joining the Academy?", "Yes. It is available separately through Nestuge. You can also buy both."],
  ["Will there be another cohort?", "Future cohorts are announced on this website and through the Academy's official channels."],
] as const;
