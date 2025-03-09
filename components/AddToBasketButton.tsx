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

  // Use useEffect to set isClient to true when the component mounts
  // This ensures that the component only renders on the client side
  // preventing hydration errors due to server/client mismatch
  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;
  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        className={`h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors duration-200 ${itemCount === 0 ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"}`}
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
        className={`h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black text-white transition-colors duration-200 ${disabled ? "cursor-not-allowed bg-gray-100" : ""}`}
        onClick={() => addItem(product)}
        disabled={disabled}
      >
        <span className="text-xl font-bold">+</span>
      </button>
    </div>
  );
}

export default AddToBasketButton;
