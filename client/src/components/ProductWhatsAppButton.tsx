"use client";

import { ShoppingCart } from "lucide-react";

interface ProductWhatsAppButtonProps {
  phone: string;
  imageUrl: string;
  productName: string;
  reference?: string;
  className?: string;
}

const ProductWhatsAppButton = ({ 
  phone, 
  productName, 
  reference, 
  className = "" ,
  imageUrl,
}: ProductWhatsAppButtonProps) => {
  const handleWhatsAppClick = () => {
    const message = `¡Hola! Me interesa el producto: ${productName}${imageUrl ? ` (Imagen: ${imageUrl}) ` : ''}`;  
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`flex items-center justify-center gap-2 ${className}`}
    >
     <ShoppingCart className="w-4 h-4" />
      <span>Comprar</span>
    </button>
  );
};

export default ProductWhatsAppButton;
