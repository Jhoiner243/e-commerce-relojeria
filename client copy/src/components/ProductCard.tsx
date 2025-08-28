"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import WhatsAppButton from "./WhatsAppButton";

const ProductCard = ({ product }: { product: ProductType }) => {


  const { addToCart } = useCartStore();
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
        <div className="relative aspect-[2.3/3] " >
          <Image
            width={500}
            height={700}
            src={product.images}
            alt={product.name}
            className="object-cover hover:scale-105 transition-all duration-300 rounded-md"
          />
        </div>
      </Link>
      {/* PRODUCT DETAIL */}
      <div className="flex flex-col gap-4">
        <div >
        <h1 className="font-medium">{product.name}</h1>
          <p className="text-gray-500">{product.description.slice(0, 50)}</p>
        </div>
        {/* PRICE AND ADD TO CART BUTTON */}
          <p className="font-medium">${product.price.toFixed(2)}</p>
        <div className=" w-full">
          <WhatsAppButton
            phone="573001112233"
            productName={product.name}
            reference={product.reference}
            className=" justify-center transition-all duration-300 flex items-center gap-2 border-1"
          />
   
           
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
