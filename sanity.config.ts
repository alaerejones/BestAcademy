import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "ngo-academy",
  title: "The NGO Academy",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title("Content").items([
          S.listItem().title("Site settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
          S.divider(),
          ...S.documentTypeListItems().filter((i) => i.getId() !== "siteSettings"),
        ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
