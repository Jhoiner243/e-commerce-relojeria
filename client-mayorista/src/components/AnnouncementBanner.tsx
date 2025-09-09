"use client";

import { Phone, TruckIcon, X } from "lucide-react";
import { useState } from "react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <div className="flex items-center space-x-2 justify-items-end">
          <span className="text-sm font-medium flex gap-2 left-0 m-2">
            <TruckIcon className="w-4 h-4 " />
            Envíos a todo Colombia
          </span>
          <span className="border-l-2 border-white h-4"/>

          <span className="text-sm font-medium gap-2 right-0 hover:cursor-pointer hover:text-white/60 flex  left-0 m-2" 
                onClick={() => window.open("https://wa.me/send?phone=573147353497", "_blank")}
          >
            <Phone className="w-4 h-4"/>
            Contáctanos
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Cerrar anuncio"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
