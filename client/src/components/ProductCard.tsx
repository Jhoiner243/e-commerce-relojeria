"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: ProductType }) => {


  const { addToCart } = useCartStore();
  const [hover, setHover] = useState(false);
  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
   
    });
    toast.success("Product added to cart")
  };

  return (
    <div className="overflow-hidden">
      {/* IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative ">
          <Image
            width={500}
            height={700}
            src={product.images}
            alt={product.name}
            className="object-cover hover:scale-105 transition-all duration-300"
          />
        </div>
      </Link>
      {/* PRODUCT DETAIL */}
      <div className="flex flex-col gap-4 ">
        <div>
        <h1 className="font-medium">{product.name}</h1>
          <p className="text-gray-500">{product.description.slice(0, 50)}</p>
        </div>
        {/* PRICE AND ADD TO CART BUTTON */}
          <p className="font-medium">${product.price.toFixed(2)}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={handleAddToCart}
            className="w-full justify-center ring-1 ring-gray-200 shadow-lg bg-blue-950 text-white  px-2 py-1 text-sm cursor-pointer hover:text-white hover:bg-black transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            COMPRAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
