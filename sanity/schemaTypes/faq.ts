import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "array", of: [{ type: "block" }], validation: (r) => r.required() }),
    defineField({ name: "topic", type: "string", options: { list: ["Eligibility", "Format", "Pricing", "Application", "Payments", "Completion", "Playbook"] } }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "published", type: "boolean", initialValue: false, description: "Leave unpublished until the answer is confirmed." }),
  ],
  preview: { select: { title: "question", subtitle: "topic" } },
});
