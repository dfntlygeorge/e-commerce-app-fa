import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = product.stock != null && product.stock <= 0;
  console.log(
    "Product image: ",
    product.image && imageUrl(product.image).url(),
  );

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md ${isOutOfStock ? "opacity-50" : ""}`}
    >
      <div className="relative aspect-square h-full w-full overflow-hidden">
        {product.image && (
          <Image
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            src={imageUrl(product.image).url()}
            alt={product.name || "Product Image"}
            fill
            // what is this?
            sizes="(max-width: 768px) 100vw,(max-width:1200px) 50vw, 33vw"
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 opacity-50 group-hover:opacity-70">
            <span className="text-lg font-bold text-white">Out of stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="truncate text-lg font-semibold text-gray-800">
          {product.name}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {/* kase markdown yung description that is coming from sanity */}
          {product.description
            ?.map((block) =>
              block._type === "block"
                ? block.children?.map((child) => child.text).join("")
                : "",
            )
            .join("") || "No description available"}
        </p>
        <p className="mt-2 text-lg font-bold text-gray-900">
          P{product.price?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

export default ProductThumb;
