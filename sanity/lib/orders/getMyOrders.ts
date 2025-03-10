import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getMyOrders(userId: string) {
  if (!userId) {
    throw new Error("userId is required");
  }

  // Define the query to get orders based on the user ID, sorted by orderDate in descending order

  const MY_ORDERS_QUERY =
    defineQuery(`*[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
        ...,products[]{ // span the array if we have embedded products inside
            ...,product-> // references
        }
    }`);

  try {
    // use Sanity fetch to get the data and pass the userId as a parameter
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    // Return this list of orders, or an empty array if there are none
    // console.log(orders.data);
    return orders.data || [];
  } catch (err) {
    console.error("Error fetching orders by user ID", err);
    throw new Error("Error fetching orders");
  }
}
