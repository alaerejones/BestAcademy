import { defineField, defineType } from "sanity";

/** Written only by the server (write token). Document ids contain a dot, so they are private to public queries. */
export const registration = defineType({
  name: "registration",
  title: "Registration",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "reference", type: "string" }),
    defineField({ name: "status", type: "string", options: { list: ["initiated", "paid", "failed", "cancelled", "review"] } }),
    defineField({ name: "fullName", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "organisation", type: "string" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "country", type: "string" }),
    defineField({ name: "package", type: "string" }),
    defineField({ name: "currency", type: "string" }),
    defineField({ name: "amountMinor", title: "Amount (kobo or cents)", type: "number" }),
    defineField({ name: "paidAt", type: "datetime" }),
    defineField({ name: "extraRepresentatives", type: "text" }),
    defineField({ name: "summary", type: "string" }),
    defineField({ name: "cohort", type: "reference", to: [{ type: "cohort" }] }),
  ],
  preview: { select: { title: "fullName", subtitle: "status" } },
});
