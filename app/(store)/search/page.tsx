import ProductGrid from "@/components/ProductGrid";
import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";

async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  // we need to destruct the query from the searchParams object. Also we need to await it for nextjs 15.
  const { query } = await searchParams;
  const products = await searchProductsByName(query);

  if (!products.length) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
        <div className="border-border bg-card w-full max-w-3xl rounded-2xl border p-10 text-center shadow-lg">
          <h1 className="text-foreground mb-4 text-2xl font-bold">
            No products found for: <span className="text-primary">{query}</span>
          </h1>
          <p className="text-muted-foreground">
            Try searching with different keywords or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-start p-6">
      <div className="border-border bg-card w-full max-w-4xl rounded-2xl border p-8 shadow-lg">
        <h1 className="text-foreground mb-6 text-center text-3xl font-bold">
          Search results for: <span className="text-primary">{query}</span>
        </h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default SearchPage;
