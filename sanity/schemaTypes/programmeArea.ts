import { defineField, defineType } from "sanity";

export const programmeArea = defineType({
  name: "programmeArea",
  title: "Programme area",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", validation: (r) => r.required().integer().min(1).max(8) }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "weekTitle", title: "Week title", type: "string" }),
    defineField({ name: "curriculumConfirmed", title: "Curriculum confirmed by Dr. Best", type: "boolean", initialValue: false, description: "Week titles stay marked as proposed until this is ticked." }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "weekTitle" } },
});
