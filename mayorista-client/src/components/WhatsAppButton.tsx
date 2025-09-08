"use client";

import { ShoppingCart } from "lucide-react";

type Props = {
  phone: string;
  productName: string;
  imageUrl: string; 
  reference?: string;
  className?: string;
};

const encodeMessage = (text: string) => encodeURIComponent(text);

const WhatsAppButton = ({ phone, productName, reference, className, imageUrl }: Props) => {
  const message = `Hola, estoy interesado en el reloj ${productName}${
    reference ? ` (ref: ${reference})` : ""
  }. ¿Está disponible?\n\nImagen: ${imageUrl}`;

  const href = `https://wa.me/${phone}?text=${encodeMessage(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        "bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-medium w-full"
      }
    >
      <ShoppingCart className="w-4 h-4" />
      Comprar
    </a>
  );
};

export default WhatsAppButton;
