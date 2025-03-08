import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getProductsByCategory } from "@/sanity/lib/products/getProductsByCategory";
import React from "react";

async function CategoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);
  const categories = await getAllCategories();

  if (!products.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-start bg-gray-100 p-4">
        <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-3xl font-bold">
            No products found for: {slug.replace("-", " ")}
          </h1>
          <p className="text-center text-gray-600">
            Try selecting a different category or check back later.
          </p>
          <ProductsView products={products} categories={categories} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-100 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold">
          {slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}{" "}
          Collection
        </h1>
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}

export default CategoriesPage;
