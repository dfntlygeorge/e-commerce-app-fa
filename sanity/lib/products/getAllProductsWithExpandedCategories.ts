import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { ProductWithExpandedCategories } from "@/app/api/shopping-assistant/route";

// Define query for fetching products with categories
const GET_PRODUCTS_WITH_CATEGORIES_QUERY = defineQuery(`
  *[_type == "product"] {
    ...,
    "categories": categories[]->{
      _id, title, slug, description
    }
  }
`);

// Fetch all products with expanded categories
export const getProductsWithCategories = async (): Promise<
  ProductWithExpandedCategories[]
> => {
  try {
    const products = await sanityFetch({
      query: GET_PRODUCTS_WITH_CATEGORIES_QUERY,
    });
    return products?.data || [];
  } catch (err) {
    console.error("Error fetching products with categories:", err);
    return [];
  }
};
