import { CartStoreActionsType, CartStoreStateType } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,
      addToCart: (product) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (p) =>
              p.id === product.id 
          );

          if (existingIndex !== -1) {
            const updatedCart = [...state.cart];
            const updatedItem = { ...updatedCart[existingIndex] };
            const newQuantity = updatedItem.quantity + (product.quantity || 1);
            updatedItem.quantity = Math.min(newQuantity, 99);
            updatedCart[existingIndex] = updatedItem;
            return { cart: updatedCart };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: Math.min(product.quantity || 1, 99),
              },
            ],
          };
        }),
      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter(
            (p) =>
              p.id !== product.id
          ),
        })),
      updateQuantity: (id, newQuantity) =>
        set((state) => ({
          cart: state.cart.map((p) =>
            p.id === id ? { ...p, quantity: Math.max(1, Math.min(newQuantity, 99)) } : p
          ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);

export default useCartStore;
