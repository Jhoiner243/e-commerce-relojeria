"use client";

// import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import { Eye, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatCurrency } from "../utils/format-currency";
import ProductWhatsAppButton from "./ProductWhatsAppButton";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

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
  // const { addToCart } = useCartStore();
  // const [isHovered, setIsHovered] = useState(false);

  // const handleAddToCart = () => {
  //   addToCart({
  //     ...product,
  //     quantity: 1,
  //   });
  //   toast.success("Producto agregado al carrito");
  // };

  return (
    <div
      className="group transition-all duration-300 overflow-hidden hover:border-primary/30 max-w-sm mx-auto flex flex-col"
    >
      {/* IMAGE SECTION */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[2.4/3] overflow-hidden bg-muted/30">
          <Image
            width={400}
            height={500}
            src={product.imagen.replace(
              "/upload/",
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
        <div className="space-y-2">
          <h3 className="font-semibold text-xl text-foreground transition-colors duration-300">
            {product.nombre}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed min-h-[3rem]">
            {product.descripcion}
          </p>
        </div>

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
              {/* Close button */}
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

              {/* Zoom controls */}
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

              {/* Zoom level indicator */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(zoom * 100)}%
                </div>
              </div>

              {/* Image container */}
              <div
                className="relative w-full aspect-[4/7] md:aspect-[16/9] bg-black overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                <Image
                  fill
                  priority
                  src={product.imagen.replace(
                    "/upload/",
                    "/upload/q_auto,f_auto,e_improve/"
                  ) || "/placeholder.svg?height=800&width=1200&query=modern product image"}
                  alt={product.nombre || "Producto"}
                  className="object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                    transformOrigin: 'center center'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Botón Comprar */}
        <ProductWhatsAppButton
          phone={process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "573147353497"}
          imageUrl={product.imagen}
          productName={product.nombre}
          reference={product.reference}
          className="w-full border text-primary-foreground p-2 font-semibold text-sm transition-all duration-200 hover:bg-blue-600 hover:text-white rounded-md mt-3"
        />
      </div>
    </div>

  );
};

export default ProductCard;
