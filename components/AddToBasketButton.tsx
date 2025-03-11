"use client";

import { Product } from "@/sanity.types";
import useBasketStore from "@/state/store";
import { useEffect, useState } from "react";

function AddToBasketButton({
  product,
  disabled,
}: {
  product: Product;
  disabled?: boolean;
}) {
  const { addItem, getItemCount, removeItem } = useBasketStore();
  const itemCount = getItemCount(product._id);
  const [isClient, setIsClient] = useState(false);
  const currentStock = product.stock;

  // Ensure the component only renders on the client side
  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center space-x-2">
        <button
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
            itemCount === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed" // Disabled: muted colors
              : "bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow-md active:scale-95"
          }`}
          onClick={() => removeItem(product._id)}
          disabled={itemCount === 0 || disabled}
        >
          <span
            className={`text-xl font-bold ${
              itemCount === 0 ? "text-muted-foreground" : ""
            }`}
          >
            -
          </span>
        </button>
        <span className="w-8 text-center font-semibold">{itemCount}</span>
        <button
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
            disabled || itemCount === currentStock
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-md active:scale-95"
          }`}
          onClick={() => addItem(product)}
          disabled={disabled || itemCount === currentStock}
        >
          <span className="text-xl font-bold">+</span>
        </button>
      </div>
      <div className="h-4">
        {itemCount === currentStock && (
          <p className="text-muted-foreground text-center text-xs">
            Maximum quantity reached
          </p>
        )}
      </div>
    </div>
  );
}

export default AddToBasketButton;
