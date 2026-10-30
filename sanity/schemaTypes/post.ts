import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "status", title: "Status", type: "string", options: { list: ["draft", "published"], layout: "radio" }, initialValue: "draft", validation: (r) => r.required() }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "excerpt", type: "text", rows: 3, validation: (r) => r.required().max(240) }),
    defineField({ name: "mainImage", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative text", type: "string", validation: (r) => r.required() })] }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }, { type: "image", fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })] }] }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }], validation: (r) => r.required() }),
    defineField({ name: "category", type: "string", options: { list: ["NGO strategy", "Grant readiness", "Funding", "Governance", "Programme management", "Financial management", "Impact measurement", "NGO communications", "Partnerships", "Sustainability", "AI for NGOs", "Leadership"] } }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "updatedAt", type: "datetime" }),
    defineField({ name: "seoTitle", type: "string", validation: (r) => r.max(60) }),
    defineField({ name: "seoDescription", type: "text", rows: 2, validation: (r) => r.max(160) }),
    defineField({ name: "shareImage", title: "Social sharing image", type: "image" }),
  ],
  preview: { select: { title: "title", subtitle: "status", media: "mainImage" } },
});
