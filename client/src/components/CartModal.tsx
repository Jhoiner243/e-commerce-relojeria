"use client";

import useCartStore from "@/stores/cartStore";
import { formatCurrency } from "@/utils/format-currency";
import { X, Minus, Plus, Trash2, ShoppingCart, Send } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { cart, hasHydrated, removeFromCart, updateQuantity: updateQuantityStore, clearCart } = useCartStore();
  const [showModal, setShowModal] = useState(false);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMount(true);
      requestAnimationFrame(() => setShowModal(true));
      document.body.style.overflow = "hidden";
    } else {
      setShowModal(false);
      const timer = setTimeout(() => {
        setMount(false);
      }, 300); // Wait for transition
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clean up
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = cart.find((p) => p.id === productId);
    if (product) {
      const newQty = product.quantity + delta;
      if (newQty <= 0) {
        removeFromCart(product);
      } else {
        updateQuantityStore(product.id, newQty);
      }
    }
  };

  const getOptimizedImageUrl = (url: string | undefined | null) => {
    if (!url) return "";
    return url.replace(/\/upload\/(?:[a-zA-Z0-9_,-]+\/)?/, "/upload/w_150,h_150,c_fill,q_auto,f_auto/");
  };

  const generateWhatsAppMessage = () => {
    const phone = "573147353497";
    const total = cart.reduce(
      (acc, item) => acc + item.precio * item.quantity,
      0
    );

    let message = `*MI PEDIDO*\n\n`;

    cart.forEach((item) => {
      const price = item.precio;
      const subtotal = price * item.quantity;
      const imageUrl = getOptimizedImageUrl(item.imagen);

      message += `• *${item.nombre.trim()}*\n`;
      message += `  Cantidad: ${item.quantity}\n`;
      message += `  Precio: ${formatCurrency(price)}\n`;
      message += `  Subtotal: ${formatCurrency(subtotal)}\n`;
      message += `  Imagen: ${imageUrl}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*TOTAL: ${formatCurrency(total)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `¡Hola! Quiero realizar este pedido.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleCheckout = () => {
    const url = generateWhatsAppMessage();
    window.open(url, "_blank");
    clearCart();
    handleClose();
  };

  if (!hasHydrated || !mount) return null;

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${showModal ? "opacity-100" : "opacity-0"
          }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${showModal ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Carrito de compras</h2>
            <span className="bg-amber-400 text-gray-600 px-2 py-0.5 rounded-full text-sm font-medium">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-140px)] overflow-hidden">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400">
                Agrega productos para comenzar
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map((item) => {
                const price = item.precio;
                const subtotal = price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-white">
                      <Image
                        src={
                          getOptimizedImageUrl(item.imagen) ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={item.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {item.nombre}
                      </h3>
                      <p className="text-green-800 font-semibold text-sm mt-1">
                        {formatCurrency(price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(item.id, -1);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                            aria-label={item.quantity === 1 ? "Eliminar producto" : "Disminuir cantidad"}
                          >
                            <Minus className="w-3 h-3 pointer-events-none" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (item.quantity < 99) updateQuantity(item.id, 1);
                            }}
                            className={`w-7 h-7 flex items-center justify-center rounded-full bg-white border transition-colors ${item.quantity >= 99 ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-100'}`}
                            aria-label="Aumentar cantidad"
                            disabled={item.quantity >= 99}
                          >
                            <Plus className="w-3 h-3 pointer-events-none" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromCart(item);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4 pointer-events-none" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(subtotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total:</span>
              <span className="text-xl font-bold text-green-800">
                {formatCurrency(total)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              <Send className="w-4 h-4" />
              Comprar por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;
