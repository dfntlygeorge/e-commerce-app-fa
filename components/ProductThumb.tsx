import { Product } from "@/sanity.types";
import Link from "next/link";

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md ${isOutOfStock ? "opacity-50" : ""}`}
    >
      Product
    </Link>
  );
}

export default ProductThumb;
