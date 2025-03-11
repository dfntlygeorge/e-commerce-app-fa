"use client";

import { Product } from "@/sanity.types";
import { motion, AnimatePresence } from "framer-motion";
import ProductThumb from "./ProductThumb";

function ProductGrid({ products }: { products: Product[] }) {
  // console.log("Products data:", products);
  // console.log(
  //   "Array ba sha kase if hinde hindi map is not function: ",
  //   Array.isArray(products),
  // );
  // console.log("Type of products: ", typeof products);

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products?.map((product) => {
        // use framer motion
        return (
          <AnimatePresence key={product._id}>
            <motion.div
              layout
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <ProductThumb key={product._id} product={product} />
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
}

export default ProductGrid;
