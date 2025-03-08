import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_ID_QUERY = defineQuery(`
    *[_type == "product" && slug.current == $slug] | order(name asc) [0]`);

  try {
    // Use the sanity fetch to send the query with slug as the parameter
    const product = await sanityFetch({
      query: PRODUCT_BY_ID_QUERY,
      params: {
        slug,
      },
    });

    return product.data || null;
  } catch (err) {
    console.error("Error fetching the product by slug: ", err);
    return null;
  }
};
