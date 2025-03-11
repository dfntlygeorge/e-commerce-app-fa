"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShoppingAssistant from "./ShoppingAssistant";
import { ProductWithExpandedCategories } from "@/app/api/shopping-assistant/route";

export default function ChatToggle({
  products,
}: {
  products: ProductWithExpandedCategories[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null); // 🔹 Added ref for the toggle button

  // 🔹 Close chat when clicking outside (but ignore button clicks)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        buttonRef.current !== event.target // 🔹 Ignore button clicks
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <Button
        ref={buttonRef} // 🔹 Assign ref to the button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed right-4 bottom-16 z-50 shadow-lg"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div
          ref={chatRef} // 🔹 Assign ref to the chat container
          className="fixed right-16 bottom-16 z-50 w-[350px]"
        >
          <ShoppingAssistant products={products} />
        </div>
      )}
    </>
  );
}
