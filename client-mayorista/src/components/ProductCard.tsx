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
          <p className="text-lg font-semibold text-green-800">
            {formatCurrency(product.mayoristaPrice ? product.mayoristaPrice : product.precio)}
          </p>
        </div>

        {/* BOTONES al final */}

        <ProductWhatsAppButton
          imageUrl={product.imagen}
          phone="573147353497"
          productName={product.nombre}
          reference={product.reference}
          className="w-full border text-primary-foreground p-2 font-semibold text-sm transition-all duration-200 hover:bg-blue-600 hover:text-white rounded-md"
        />
      </div>
    </div>

  );
};

export default ProductCard;
