import { Product } from "@/sanity.types";
import { create } from "zustand";
// Importing the persist middleware from Zustand to enable state persistence
import { persist } from "zustand/middleware";

/**
 * Interface representing an item in the basket.
 * @property {Product} product - The product added to the basket.
 * @property {number} quantity - The quantity of the product in the basket.
 */
export interface BasketItem {
  product: Product;
  quantity: number;
}

/**
 * Interface defining the structure and operations of the basket store.
 * @property {BasketItem[]} items - Array of items currently in the basket.
 * @property {(product: Product) => void} addItem - Function to add a product to the basket.
 * @property {(productId: string) => void} removeItem - Function to remove a product from the basket by its ID.
 * @property {() => void} clearBasket - Function to clear all items from the basket.
 * @property {() => number} getTotalPrice - Function to calculate the total price of items in the basket.
 * @property {(productId: string) => number} getItemCount - Function to get the quantity of a specific product by its ID.
 * @property {() => BasketItem[]} getGroupedItems - Function to retrieve all items in the basket.
 */
interface BasketInterface {
  items: BasketItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearBasket: () => void;
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => BasketItem[];
}

// Creating a Zustand store for the basket, with state persistence
const useBasketStore = create<BasketInterface>()(
  persist(
    (set, get) => ({
      // Initial state: empty basket
      items: [],

      /**
       * Adds a product to the basket. If the product already exists, increments its quantity.
       * @param {Product} product - The product to add.
       */
      addItem: (product) =>
        set((state) => {
          // Check if the product already exists in the basket
          const existingItem = state.items.find(
            (item) => item.product._id === product._id,
          );

          if (existingItem) {
            // Increment quantity if product exists
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          } else {
            // Add new product to the basket
            return {
              items: [...state.items, { product, quantity: 1 }],
            };
          }
        }),

      /**
       * Removes a product from the basket by its ID. If the product's quantity is more than one, decrements its quantity; otherwise, removes it from the basket.
       * @param {string} productId - The ID of the product to remove.
       */
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce<BasketItem[]>((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                // Decrement quantity if more than one
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
              // If quantity is one, item is not added to the accumulator, effectively removing it
            } else {
              // Keep items that don't match the productId
              acc.push(item);
            }
            return acc;
          }, []),
        })),

      /**
       * Clears all items from the basket.
       */
      clearBasket: () => set({ items: [] }),

      /**
       * Calculates the total price of all items in the basket.
       * @returns {number} - The total price.
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0,
        );
      },

      /**
       * Retrieves the quantity of a specific product in the basket by its ID.
       * @param {string} productId - The ID of the product.
       * @returns {number} - The quantity of the product in the basket.
       */
      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },

      /**
       * Retrieves all items currently in the basket.
       * @returns {BasketItem[]} - Array of items in the basket.
       */
      getGroupedItems: () => get().items,
    }),
    {
      // Name of the storage key for persistence
      name: "basket-store",
    },
  ),
);

export default useBasketStore;
