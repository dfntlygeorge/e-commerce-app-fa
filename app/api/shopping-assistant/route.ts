// app/api/shopping-assistant/route.ts

import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { Product, Category } from "@/sanity.types";

// ✅ Define an interface for products with expanded category details
export interface ProductWithExpandedCategories
  extends Omit<Product, "categories"> {
  categories?: Array<Category>;
}

// ✅ Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env file
});

console.log("<<<<<<OPENAI KEY>>>>>>", process.env.OPENAI_API_KEY); // Debugging: Logs API key visibility (remove in production)

export async function POST(request: Request) {
  try {
    // ✅ Parse the incoming request body
    const { query, products } = await request.json();

    // ✅ Validate that both query and products are provided
    if (!query || !products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // ✅ Format product information into a text-based context for OpenAI
    const productContext = products
      .map((p: ProductWithExpandedCategories) => {
        // ✅ Extract category names
        const categoryNames = p.categories
          ? p.categories.map((c) => c.title || "Unnamed category").join(", ")
          : "No categories";

        // ✅ Handle different description formats from Sanity CMS
        let descriptionText = "No description available";
        if (p.description && Array.isArray(p.description)) {
          // ✅ Extract text from Portable Text format (Sanity CMS)
          descriptionText = p.description
            .filter((block) => block._type === "block")
            .flatMap((block) => {
              if ("children" in block && Array.isArray(block.children)) {
                return block.children
                  .filter(
                    (child) =>
                      "text" in child && typeof child.text === "string",
                  )
                  .map((child) => child.text)
                  .join(" ");
              }
              return [];
            })
            .join(" ");

          // ✅ If no valid text was found, provide a fallback message
          if (!descriptionText) {
            descriptionText = "Description available but in a complex format";
          }
        }

        // ✅ Format product details
        return `Product: ${p.name || "Unnamed product"}
Price: $${p.price !== undefined ? p.price : "Price not available"}
Stock: ${p.stock !== undefined ? p.stock : "Stock not available"} available
Categories: ${categoryNames}
Description: ${descriptionText}`;
      })
      .join("\n\n"); // ✅ Separate products with a newline for better readability

    // ✅ Create the system message that instructs the AI how to behave
    const systemPrompt = `
You are a specialized shopping assistant for "Cat Stealth & Military Equipment," a fictitious e-commerce store selling fun military-style and stealth equipment for cats.

Your purpose is to help customers find the perfect stealth and tactical gear for their feline friends. Be fun, slightly dramatic, and use military/tactical terminology when appropriate. Remember, this is fictional equipment for cats - keep it lighthearted!

Here's information about the available products:
${productContext}

When recommending products:
1. Suggest specific products by name from the list provided
2. Explain why they would be good for the customer's needs
3. Compare products when appropriate
4. Mention price and availability (stock)
5. Be concise but informative, just limit to one short paragraph.
6. Use "P" as the currency.

If asked about products not in our catalog, politely explain we don't carry that item but suggest alternatives we do have.
`;

    // ✅ Send request to OpenAI with user query and system prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ✅ AI model being used (efficient for this use case)
      messages: [
        {
          role: "system",
          content: systemPrompt, // ✅ Provides product details and guidelines for AI responses
        },
        {
          role: "user",
          content: query, // ✅ The actual user query from the request
        },
      ],
    });

    // ✅ Return AI-generated response
    return NextResponse.json({
      response: completion.choices[0].message.content, // ✅ Extracts the AI's reply
    });
  } catch (error) {
    // ✅ Handle errors gracefully
    console.error("Error in shopping assistant:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
