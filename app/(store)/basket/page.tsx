"use client";

import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "@/state/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import { Button } from "@/components/ui/button";

function BasketPage() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use useEffect to set isClient to true when the component mounts
  useEffect(() => setIsClient(true), []);
  if (!isClient) return <Loader />;

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4">
        <h1 className="text-muted-foreground mb-6 text-2xl font-bold">
          Your basket
        </h1>
        <p className="text-muted-foreground text-lg">Your basket is empty</p>
      </div>
    );
  }
  const handleCheckout = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);

    try {
      // Create a unique order number
      // Get the customer's name and email from Clerk
      // If the customer is not signed in, use "Anonymous"
      // Get the Clerk user ID
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Anonymous",
        customerEmail: user?.emailAddresses[0].emailAddress ?? "Anonymous",
        clerkUserId: user!.id,
      };

      // Call the createCheckoutSession function to create a checkout session
      // with the metadata we just created
      // If the function returns a URL, redirect the user to that URL
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.error("Error creating checkout session: ", err);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("BASKET CONTENTS", groupedItems);

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Your Basket</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-grow">
          {groupedItems.map((item) => (
            <div
              key={item.product._id}
              className="mb-4 flex items-center justify-between rounded border p-4"
            >
              <div
                className="flex min-w-0 flex-1 cursor-pointer items-center"
                onClick={() =>
                  router.push(`/product/${item.product.slug?.current}`)
                }
              >
                <div className="mr-4 h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24">
                  {item.product.image && (
                    <Image
                      src={imageUrl(item.product.image).url()}
                      alt={item.product.name ?? "Product image"}
                      width={100}
                      height={100}
                      className="h-full w-full rounded object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold sm:text-xl">
                    {item.product.name}
                  </h2>
                  <p className="text-sm sm:text-base">
                    Price: P
                    {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                <AddToBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>
        <div className="border-border bg-card fixed bottom-0 left-0 order-first h-fit w-full rounded-md border p-6 shadow-md lg:sticky lg:top-4 lg:left-auto lg:order-last lg:w-80">
          <h3 className="text-foreground text-xl font-semibold">
            Order Summary
          </h3>
          <div className="mt-4 space-y-2">
            <p className="text-muted-foreground flex justify-between">
              <span>Items:</span>
              <span>
                {groupedItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>
            <p className="border-border text-foreground flex justify-between border-t pt-2 text-2xl font-bold">
              <span>Total:</span>
              <span>
                P{useBasketStore.getState().getTotalPrice().toFixed(2)}
              </span>
            </p>
          </div>
          {isSignedIn ? (
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="mt-4 w-full cursor-pointer"
            >
              {isLoading ? "Processing..." : "Checkout"}
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="mt-4 w-full">Sign in to Checkout</Button>
            </SignInButton>
          )}
        </div>

        <div className="h-64 lg:h-0">
          {/* Spacer for scrolling on mobile */}
        </div>
      </div>
    </div>
  );
}

export default BasketPage;
