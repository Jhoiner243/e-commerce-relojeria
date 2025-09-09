"use client";

import { ProductType } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import ProductWhatsAppButton from "./ProductWhatsAppButton";

const ProductInteraction = ({
  product,
}: {
  product: ProductType;
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };


  return (
    <div className="flex flex-col gap-4 mt-4">


      {/* QUANTITY */}
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-gray-500">Cantidad</span>
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("decrement")}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span>{quantity}</span>
          <button
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("increment")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* BUTTONS */}

      <ProductWhatsAppButton
        imageUrl={product.imagen}
        phone="573001112233"
        productName={product.nombre}
        reference={product.reference}
      />
    </div>
  );
};

export default ProductInteraction;
