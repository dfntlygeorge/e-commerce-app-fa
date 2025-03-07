import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  // Overall, this structure customizes the Sanity Studio's sidebar to include a "Categories" section, a divider, and all other document types except "post" and "category".
  S.list()
    .title("Aqua E-Commerce")
    .items([
      S.documentTypeListItem("category").title("Categories"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !["post", "category"].includes(item.getId()!),
      ),
    ]);
