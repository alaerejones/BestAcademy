import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "photo", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }),
    defineField({ name: "bio", type: "text", rows: 4 }),
    defineField({ name: "profileLinks", type: "array", of: [{ type: "url" }] }),
  ],
});
