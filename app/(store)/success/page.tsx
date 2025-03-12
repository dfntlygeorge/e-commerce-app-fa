"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useBasketStore from "@/state/store";

function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearBasket = useBasketStore((state) => state.clearBasket);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (orderNumber) clearBasket();
  }, [orderNumber, clearBasket]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <div className="bg-card mx-4 w-full max-w-2xl rounded-xl p-12 shadow-lg">
        <div className="mb-8 flex justify-center">
          <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-primary h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-foreground mb-6 text-center text-4xl font-bold">
          Thank You for Your Order!
        </h1>
        <div className="border-border mb-6 border-t border-b py-6">
          <p className="text-foreground mb-4 text-lg">
            Your order has been placed and will be shipped by our team.
          </p>
          <div className="space-y-2">
            {orderNumber && (
              <p className="text-muted-foreground flex items-center space-x-5">
                <span>Order Number:</span>
                <span className="text-primary font-mono text-sm">
                  {orderNumber}
                </span>
              </p>
            )}
            {sessionId && (
              <p className="text-muted-foreground flex items-center space-x-5">
                <span>Transaction ID:</span>
                <span className="text-primary font-mono text-sm">
                  {sessionId}
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You will receive an email with the details of your order.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild className="bg-primary hover:bg-primary/80">
              <Link href="/orders">View Order Details</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
