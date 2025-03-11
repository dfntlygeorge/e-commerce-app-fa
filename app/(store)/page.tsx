import ProductsView from "@/components/ProductsView";
// import ShoppingAssistant from "@/components/shopping-assistant/ShoppingAssistant";
import WhiteFridayBanner from "@/components/WhiteFridayBanner";
import { Product } from "@/sanity.types";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
// import { getProductsWithCategories } from "@/sanity/lib/products/getAllProductsWithExpandedCategories";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const products = (await getAllProducts()) as Product[];
  const categories = await getAllCategories();
  // const productsWithCategories = await getProductsWithCategories();

  // how caching in nextjs works.
  console.log(
    crypto.randomUUID().slice(0, 5) +
      `>>> Rendered the homepage with ${products.length} products and ${categories.length} categories`,
  );
  return (
    <div>
      {/* White Friday Banner */}
      <WhiteFridayBanner />
      {/* Render all the products */}

      <div className="flex min-h-screen flex-col items-center justify-start p-4">
        <ProductsView products={products} categories={categories} />
      </div>
      {/* <ShoppingAssistant products={productsWithCategories} /> */}
    </div>
  );
}
