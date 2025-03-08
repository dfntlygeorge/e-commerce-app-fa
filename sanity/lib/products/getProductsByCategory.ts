import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategory = async (categorySlug: string) => {
  const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
        *[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id) ] | order(name asc)`);

  try {
    // use Sanity fetch to get the data and pass the categorySlug as a parameter
    const products = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: { categorySlug },
    });
    // Return this list of products, or an empty array if there are none
    return products.data || [];
  } catch (err) {
    console.error("Error fetching products by category", err);
    return [];
  }
};
