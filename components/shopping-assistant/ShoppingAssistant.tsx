"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ProductWithExpandedCategories } from "@/app/api/shopping-assistant/route";
import { marked } from "marked";
import useChatStore from "@/state/shopping-assistant"; // 🔹 Use Zustand store

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ShoppingAssistantProps {
  products: ProductWithExpandedCategories[];
  title?: string;
}

export default function ShoppingAssistant({
  products,
  title = "Cat Tactical Advisor",
}: ShoppingAssistantProps) {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { messages, addMessage } = useChatStore(); // 🔹 Load messages from Zustand

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = { role: "user", content: query };
    addMessage(userMessage); // 🔹 Store in Zustand
    setQuery("");
    setLoading(true);

    try {
      const response = await fetch("/api/shopping-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, products }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      addMessage({ role: "assistant", content: data.response }); // 🔹 Store response in Zustand
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        role: "assistant",
        content:
          "I'm sorry, I couldn't process your request. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[85%] rounded-lg p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted text-foreground prose prose-sm dark:prose-invert",
                )}
                dangerouslySetInnerHTML={{
                  __html: marked.parse(message.content) as string,
                }}
              />
            ))}

            {loading && (
              <div className="bg-muted max-w-[85%] rounded-lg p-3">
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about cat stealth gear..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
