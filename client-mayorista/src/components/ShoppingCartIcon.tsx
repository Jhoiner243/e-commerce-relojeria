"use client";

import useCartStore from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";
import { useCartModal } from "@/contexts/CartModalContext";

const ShoppingCartIcon = () => {
  const { cart, hasHydrated } = useCartStore();
  const { openCart } = useCartModal();

  if (!hasHydrated) return null;
  return (
    <button 
      onClick={openCart}
      className="relative"
      aria-label="Abrir carrito"
    >
      <ShoppingCart className="w-4 h-4 text-gray-600" />
      {cart.length > 0 && (
        <span className="absolute -top-3 -right-3 bg-amber-400 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
          {cart.reduce((acc, item) => acc + item.quantity, 0)}
        </span>
      )}
    </button>
  );
};

export default ShoppingCartIcon;
