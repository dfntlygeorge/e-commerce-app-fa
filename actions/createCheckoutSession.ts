"use server";

import { imageUrl } from "@/lib/imageUrl";
import stripe from "@/lib/stripe";
import { BasketItem } from "@/state/store";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata,
) {
  try {
    // check if any of grouped items does not have a price

    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("One or more items do not have a price");
    }

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/basket`,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "php",
          product_data: {
            name: item.product.name || "Unnamed Product",
            description: `Product ID: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
          },
          unit_amount: Math.round(item.product.price! * 100),
        },
      })),
    });

    console.log("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL);
    return session.url;
  } catch (err) {
    console.error("Error creating checkout session: ", err);
    throw err;
  }
}
