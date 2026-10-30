import { defineField, defineType } from "sanity";

export const cohort = defineType({
  name: "cohort",
  title: "Cohort",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "published", title: "Published", type: "boolean", initialValue: false }),
    defineField({ name: "status", title: "Cohort status", type: "string", options: { list: ["upcoming", "in_progress", "completed"] }, initialValue: "upcoming" }),
    defineField({ name: "applicationStatus", type: "string", options: { list: ["open", "closed", "coming_soon"] }, initialValue: "closed" }),
    defineField({ name: "startDate", type: "date" }),
    defineField({ name: "endDate", type: "date" }),
    defineField({ name: "deadline", title: "Application deadline", type: "datetime" }),
    defineField({ name: "priceNgn", title: "Individual price (NGN)", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "priceUsd", title: "Individual price (USD)", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "orgPackagePriceNgn", title: "Organisation package, three people (NGN)", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "orgPackagePriceUsd", title: "Organisation package, three people (USD)", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "deliveryFormat", type: "string", description: "Confirm with Dr. Best before filling." }),
    defineField({ name: "registrationUrl", title: "External registration URL (optional)", description: "Leave EMPTY to use on-site registration and payment.", type: "url", validation: (r) => r.uri({ scheme: ["https"] }) }),
    defineField({ name: "confirmedBenefits", type: "array", of: [{ type: "string" }], description: "Only list benefits confirmed for the paid package." }),
  ],
  preview: { select: { title: "name", subtitle: "status" } },
});
