import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "academyName", type: "string", initialValue: "The NGO Academy", validation: (r) => r.required() }),
    defineField({ name: "organisationName", title: "Confirmed organisation name", type: "string", description: "Shown in the footer as 'A programme by ...'. Leave empty until confirmed." }),
    defineField({
      name: "applicationStatus",
      title: "Join the waitlist",
      type: "string",
      description: "Controls the whole site. If this is empty or invalid, the site shows 'closed'.",
      options: { list: [{ title: "Open", value: "open" }, { title: "Closed", value: "closed" }, { title: "Coming soon", value: "coming_soon" }], layout: "radio" },
      initialValue: "closed",
      validation: (r) => r.required(),
    }),
    defineField({ name: "applicationUrl", title: "Application URL", type: "url", validation: (r) => r.uri({ scheme: ["https"] }), description: "Optional. Leave EMPTY to use the website's own registration and Paystack payment. Only fill this to send people to an external page instead." }),
    defineField({ name: "interestListUrl", title: "Interest list URL", type: "url", validation: (r) => r.uri({ scheme: ["https"] }) }),
    defineField({ name: "nextCohortAnnouncement", title: "Next window announcement date", type: "date", description: "Only shown when status is 'Coming soon'." }),
    defineField({ name: "activeCohort", type: "reference", to: [{ type: "cohort" }] }),
    defineField({ name: "playbookUrl", title: "Playbook URL", type: "url", validation: (r) => r.uri({ scheme: ["https"] }) }),
    defineField({ name: "supportUrl", title: "Support URL", type: "url", validation: (r) => r.uri({ scheme: ["https"] }), description: "Leave empty until the purpose and payment destination are confirmed." }),
    defineField({ name: "contactEmail", type: "string", validation: (r) => r.email() }),
    defineField({ name: "whatsappNumber", type: "string" }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [{ type: "object", name: "social", fields: [
        defineField({ name: "platform", type: "string", validation: (r) => r.required() }),
        defineField({ name: "url", type: "url", validation: (r) => r.required().uri({ scheme: ["https"] }) }),
      ] }],
    }),
    defineField({ name: "logo", type: "image" }),
    defineField({ name: "seoTitle", title: "Default SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "Default SEO description", type: "text", rows: 3, validation: (r) => r.max(160) }),
    defineField({ name: "ogImage", title: "Default social sharing image", type: "image" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
