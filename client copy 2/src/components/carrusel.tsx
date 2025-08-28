"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'

const carouselSlides = [
  {
    id: 1,
    type: "promotion",
    title: "¡Promociones Especiales!",
    subtitle: "Hasta 30% de descuento en relojes seleccionados",
    description: "Aprovecha nuestras ofertas limitadas en las mejores marcas",
    buttonText: "Ver Promociones",
    background: "bg-gradient-to-r from-red-600 to-red-800",
    image: "/luxury-watches-promotion-sale.png",
  },
  {
    id: 2,
    type: "collection",
    title: "Nueva Colección 2024",
    subtitle: "Descubre los últimos diseños",
    description: "Elegancia y precisión en cada detalle",
    buttonText: "Explorar",
    background: "bg-gradient-to-r from-slate-800 to-slate-900",
    image: "/luxury-watch-collection-2024.png",
  },
  {
    id: 3,
    type: "featured",
    title: "Relojes de Lujo",
    subtitle: "Marcas exclusivas disponibles",
    description: "Rolex, Omega, Cartier y más",
    buttonText: "Ver Catálogo",
    background: "bg-gradient-to-r from-amber-700 to-amber-900",
    image: "/luxury-watch-brands-showcase.png",
  },
]
export default function CarruselPromotions() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  }

  return (
    <div className="mx-auto sm:px-0 sm:max-w-6xl md:max-w-2xl lg:max-w-8xl xl:max-w-[80%] relative h-[350px] overflow-hidden  mb-6 mt-3">
    <div
      className="flex transition-transform duration-500 ease-in-out h-full"
      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    >
      {carouselSlides.map((slide) => (
        <div key={slide.id} className={`min-w-full h-full ${slide.background} relative`}>
          <div className="absolute inset-0 flex items-center justify-between p-8 text-white">
            <div className="flex-1 max-w-lg">
              <h1 className="text-4xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-xl mb-4 text-white/90">{slide.subtitle}</h2>
              <p className="text-lg mb-6 text-white/80">{slide.description}</p>
              <button >
                {slide.buttonText}
              </button>
            </div>
            <div className="flex-1 flex justify-end">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                width={400}
                height={300}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </div>

  

    {/* Carousel Dots */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
      {carouselSlides.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-3 h-3 rounded-full transition-colors ${
            index === currentSlide ? "bg-white" : "bg-white/50"
          }`}
        />
      ))}
    </div>
  </div>
  )
}
