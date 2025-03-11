import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CategoryState {
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
}

const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      selectedCategory: null,
      setSelectedCategory: (categoryId) =>
        set({ selectedCategory: categoryId }),
    }),
    { name: "category-store" },
  ),
);

export default useCategoryStore;
