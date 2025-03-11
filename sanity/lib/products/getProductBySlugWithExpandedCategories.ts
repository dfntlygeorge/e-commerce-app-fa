import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { ProductWithExpandedCategories } from "@/app/api/shopping-assistant/route";

// Define query for fetching a product by slug
const GET_PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    ...,
    "categories": categories[]->{
      _id, title, slug, description
    }
  }
`);

// Fetch a specific product by slug with categories expanded
export const getProductBySlug = async (
  slug: string,
): Promise<ProductWithExpandedCategories | null> => {
  try {
    const product = await sanityFetch({
      query: GET_PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });
    return product?.data || null;
  } catch (err) {
    console.error("Error fetching product by slug:", err);
    return null;
  }
};
