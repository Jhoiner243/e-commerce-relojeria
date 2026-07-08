"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Promotion {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  isActive: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

export default function PromotionsCarousel() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/promotions`);
      if (response.ok) {
        const data = await response.json();
        setPromotions(data.filter((promo: Promotion) => promo.isActive));
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? promotions.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-60 md:h-72 bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Cargando promociones...</div>
      </div>
    );
  }

  if (promotions.length === 0) return null;

  return (
    <div className="relative w-full h-60 sm:h-72 md:h-80 lg:h-[500px] overflow-hidden  shadow-lg">
      {/* Slides */}
      <div className="relative w-full h-full">
        {promotions.map((promotion, index) => (
          <div
            key={promotion.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              width={1000}
              height={1000}
              src={promotion.imagen}
              alt={promotion.titulo}
              className="object-cover w-full h-full"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            {/* Content */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white px-4 sm:px-6 lg:px-12 max-w-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {promotion.titulo}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                {promotion.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {promotions.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 md:p-3 shadow transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-7 md:h-7 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 md:p-3 shadow transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-7 md:h-7 text-gray-800" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {promotions.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {promotions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
