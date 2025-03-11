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
      className={`group border-border bg-card dark:border-muted dark:bg-muted/50 flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md ${isOutOfStock ? "opacity-50" : ""}`}
    >
      <div className="relative aspect-square h-full w-full overflow-hidden">
        {product.image && (
          <Image
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            src={imageUrl(product.image).url()}
            alt={product.name || "Product Image"}
            fill
            sizes="(max-width: 768px) 100vw,(max-width:1200px) 50vw, 33vw"
          />
        )}

        {isOutOfStock && (
          <div className="bg-muted dark:bg-muted-foreground absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-70">
            <span className="text-foreground text-lg font-bold">
              Out of stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-foreground truncate text-lg font-semibold">
          {product.name}
        </h2>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
          {product.description
            ?.map((block) =>
              block._type === "block"
                ? block.children?.map((child) => child.text).join("")
                : "",
            )
            .join("") || "No description available"}
        </p>
        <p className="text-primary mt-2 text-lg font-bold">
          P{product.price?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

export default ProductThumb;
