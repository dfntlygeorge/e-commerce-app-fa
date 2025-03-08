import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllProducts = async () => {
  // use groq query language. You can go to sanity vision.
  const ALL_PRODUCTS_QUERY = defineQuery(`
    *[_type == "product"] | order(name asc)`);

  try {
    // use Sanity fetch to get the data
    const products = await sanityFetch({
      query: ALL_PRODUCTS_QUERY,
    });
    // return this list of products, or an empty array if there are none
    return products.data || [];
  } catch (err) {
    console.error("Error fetching all products", err);
    return [];
  }
};
