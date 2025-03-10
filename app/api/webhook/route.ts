import stripe from "@/lib/stripe";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { backendClient } from "@/sanity/lib/backendClient";
import Stripe from "stripe";
import { Metadata } from "@/actions/createCheckoutSession";
import { Product } from "@/sanity.types";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headerList = await headers();
  const sig = headerList.get("Stripe-Signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.log("<<<<<< Missing Stripe webhook secret >>>>>>");
    return NextResponse.json(
      { error: "Missing Stripe webhook secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(event);
  } catch (err) {
    console.log("Webhook signature verification failed", err);
    return NextResponse.json(
      { error: `Webhook error ${err}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await createOrderInSanity(session);
      console.log("Order created in Sanity: ", order);
    } catch (err) {
      console.log("Error creating order in Sanity: ", err);
      return NextResponse.json(
        {
          error: `Error creating order in Sanity: ${err}`,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, customerEmail, customerName, clerkUserId } =
    metadata as Metadata;
  // We need this to access the metadata
  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {
      expand: ["data.price.product"],
    },
  );

  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  const order = await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    customerName,
    stripePaymentIntentId: payment_intent,
    stripeCustomerId: customer,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
  });
  // IM SO SMART TALAGA
  const purchasedProducts = lineItemsWithProduct.data.map((item) => ({
    productId: (item.price?.product as Stripe.Product)?.metadata?.id, // Get product ID from Stripe metadata
    quantity: item.quantity || 0, // Get quantity purchased
  }));

  // Update stock for each purchased product
  const stockUpdates = purchasedProducts.map(
    async ({ productId, quantity }) => {
      try {
        // Fetch current stock
        const product = (await backendClient.getDocument(productId)) as Product;
        if (!product) {
          console.warn(`Product with ID ${productId} not found in Sanity.`);
          return null;
        }

        const currentStock = product.stock || 0;
        const newStock = Math.max(currentStock - quantity, 0); // Ensure stock never goes negative

        // Update stock in Sanity
        return backendClient.patch(productId).set({ stock: newStock }).commit();
      } catch (err) {
        console.error(`Error updating stock for product ${productId}:`, err);
        return null;
      }
    },
  );

  // Wait for all stock updates to complete
  await Promise.all(stockUpdates);

  return order;
}
