"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import { Eye, RotateCcw, ShoppingCart, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatCurrency } from "../utils/format-currency";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAddedToast, setShowAddedToast] = useState(false);

  const { addToCart } = useCartStore();

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      quantity: 1,
    });

    // Clear previous timeout if exists
    if (toastTimeout) clearTimeout(toastTimeout);

    setShowAddedToast(true);
    const timeout = setTimeout(() => setShowAddedToast(false), 2000);
    setToastTimeout(timeout);

  };

  return (
    <>
      <div
        className="group transition-all duration-300 overflow-hidden hover:border-primary/30 max-w-sm mx-auto flex flex-col"
      >
        {/* IMAGE SECTION */}
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-[2.4/3] overflow-hidden bg-muted/30">
            <img
              width={400}
              height={500}
              src={product.imagen?.replace(
                /\/upload\/(?:[a-zA-Z0-9_,-]+\/)?/,
                "/upload/q_auto,f_auto,e_improve/"
              ) || "/placeholder.svg?height=400&width=400&query=modern product image"}
              alt={product.nombre || "Producto"}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Eye button overlay */}
            <button
              aria-label="Ver imagen grande"
              className="absolute top-2 right-2 z-10 inline-flex items-center justify-center rounded-full bg-black/10 text-white p-2  group-hover:opacity-100 transition-opacity duration-300 "
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsImageOpen(true);
              }}
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </Link>

        {/* CONTENT SECTION */}
        <div className="p-2 flex flex-col flex-grow flex-1">
          {/* Nombre y descripción */}
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg text-foreground transition-colors duration-300 line-clamp-2">
              {product.nombre}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed min-h-[3rem]">
              {product.descripcion}
            </p>
          </div>

          {/* Precio */}
          <div className="mt-auto py-2">
            <p className="text-lg font-semibold text-black">
              {formatCurrency(product.precio)}
            </p>
          </div>

          {/* BOTONES al final */}
          <div className="flex gap-2 rounded-full">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-transparent border-1 border-black/66 hover:border-transparent rounded-full hover:bg-blue-700 text-black hover:text-white p-2 font-semibold text-sm transition-all duration-200 rounded-md"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showAddedToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          ¡Agregado al carrito!
        </div>
      )}

      {/* Fullscreen image modal */}
      {isImageOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsImageOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Cerrar"
              className="absolute -top-3 -right-3 md:top-0 md:right-0 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow hover:bg-gray-100"
              onClick={() => {
                setIsImageOpen(false)
                handleReset()
              }}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                aria-label="Acercar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow hover:bg-gray-100"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                aria-label="Alejar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow hover:bg-gray-100"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <button
                aria-label="Resetear"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow hover:bg-gray-100"
                onClick={handleReset}
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                {Math.round(zoom * 100)}%
              </div>
            </div>

            <div
              className="relative w-full aspect-[4/7] md:aspect-[16/9] bg-black overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <img
                src={product.imagen?.replace("/upload/", "/upload/w_600/") || "/placeholder.svg"}
                alt={product.nombre || "Producto"}
                className="w-full h-full object-contain transition-transform duration-200 origin-center"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
