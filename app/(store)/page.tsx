import ProductsView from "@/components/ProductsView";
import { Product } from "@/sanity.types";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export default async function Home() {
  const products = (await getAllProducts()) as Product[];
  const categories = await getAllCategories();

  // how caching in nextjs works.
  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //     `>>> Rendered the homepage with ${products.length} products and ${categories.length} categories`,
  // );
  return (
    <div>
      {/* Render all the products */}

      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
