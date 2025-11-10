import { type Product } from "@/hooks/use-products";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CheckoutStore {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
  setProducts: (products: Product[]) => void;
  hasProduct: (productId: string) => boolean;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const currentProducts = get().products;
        const exists = currentProducts.some((p) => p.id === product.id);
        if (!exists) {
          set({ products: [...currentProducts, product] });
        }
      },
      removeProduct: (productId) => {
        set({
          products: get().products.filter((p) => p.id !== productId),
        });
      },
      clearProducts: () => {
        set({ products: [] });
      },
      setProducts: (products) => {
        set({ products });
      },
      hasProduct: (productId) => {
        return get().products.some((p) => p.id === productId);
      },
    }),
    {
      name: "checkout-products-storage", // unique name for localStorage key
    }
  )
);

