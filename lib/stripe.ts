import Stripe from "stripe";
// Use the helper function from js because server actions are not very safe so we can prevent our backend from exposing our environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing Stripe secret key");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export default stripe;
