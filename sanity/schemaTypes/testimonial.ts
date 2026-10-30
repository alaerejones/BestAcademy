import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "organisation", type: "string" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "cohort", type: "string" }),
    defineField({ name: "photo", type: "image", fields: [defineField({ name: "alt", type: "string" })] }),
    defineField({ name: "approved", title: "Approved by the participant", type: "boolean", initialValue: false, description: "Only approved testimonials appear on the site." }),
    defineField({ name: "published", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "organisation" } },
});
