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

  // Use useEffect to set isClient to true when the component mounts
  // This ensures that the component only renders on the client side
  // preventing hydration errors due to server/client mismatch
  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center space-x-2">
        <button
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
            itemCount === 0
              ? "cursor-not-allowed bg-gray-300 text-gray-500" // Disabled: soft gray
              : "cursor-pointer bg-red-500 text-white shadow-md hover:bg-red-600 active:scale-95"
          }`}
          onClick={() => removeItem(product._id)}
          disabled={itemCount === 0 || disabled}
        >
          <span
            className={`text-xl font-bold ${itemCount === 0 ? "text-gray-400" : ""}`}
          >
            -
          </span>
        </button>
        <span className="w-8 text-center font-semibold">{itemCount}</span>
        <button
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
            disabled || itemCount === currentStock
              ? "cursor-not-allowed bg-gray-300 text-gray-500" // Disabled state: softer gray
              : "cursor-pointer bg-zinc-900 text-white shadow-md hover:bg-zinc-800 active:scale-95"
          }`}
          onClick={() => addItem(product)}
          disabled={disabled || itemCount === currentStock}
        >
          <span className="text-xl font-bold">+</span>
        </button>
      </div>
      <div className="h-4">
        {itemCount === currentStock && (
          <p className="text-center text-xs text-gray-500">
            Maximum quantity reached
          </p>
        )}
      </div>
    </div>
  );
}

export default AddToBasketButton;
