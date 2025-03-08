import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductsByName = async (searchParam: string) => {
  // use groq query language. You can go to sanity vision.
  const SEARCH_PRODUCTS_QUERY = defineQuery(`
    *[_type == "product" && name match $searchParam] | order(name asc)`);

  try {
    // use Sanity fetch to get the data and pass the searchParam as a parameter with a wildcard
    const products = await sanityFetch({
      query: SEARCH_PRODUCTS_QUERY,
      params: { searchParam: `*${searchParam}*` }, // Append wildcard for partial match
    });
    // return this list of products, or an empty array if there are none
    return products.data || [];
  } catch (err) {
    console.error("Error fetching products by name", err);
    return [];
  }
};
