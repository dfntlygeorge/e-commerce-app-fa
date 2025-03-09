import AddToBasketButton from "@/components/AddToBasketButton";
import { Button } from "@/components/ui/button";
import { imageUrl } from "@/lib/imageUrl";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  console.log("Fetched product by slug details: ", product);

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity-50" : ""}`}
        >
          {product.image && (
            <Image
              src={imageUrl(product.image).url()}
              alt={product.name || "Product Image"}
              fill
              className="object-contain transition-transform duration-300 hover:scale-105"
            />
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 opacity-50">
              <span className="text-lg font-bold text-white">Out of stock</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
            <div className="mb-4 text-xl font-semibold">
              P{product.price?.toFixed(2)}
            </div>
            {/* How to render a markdown data to html */}
            <div className="prose mb-6 max-w-none">
              {Array.isArray(product.description) && (
                <PortableText value={product.description} />
              )}
            </div>
          </div>
          <div className="mt-6">
            <AddToBasketButton product={product} disabled={isOutOfStock} />
            <Button>Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
