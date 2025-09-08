"use client"

import Image from "next/image"

const featuredWatches = [
  {
    id: 1,
    name: "Rolex Submariner",
    collection: "Más Exclusivos",
    price: "$8,500",
    image: "/luxury-rolex-submariner.png",
  },
  {
    id: 2,
    name: "Omega Seamaster",
    collection: "Más Exclusivos",
    price: "$4,200",
    image: "/omega-seamaster-blue-watch.png",
  },
  {
    id: 3,
    name: "TAG Heuer Monaco",
    collection: "Colección Ejecutiva",
    price: "$5,400",
    image: "/tag-heuer-monaco-black-square-watch.png",
  },
  {
    id: 4,
    name: "Breitling Navitimer",
    collection: "Colección Ejecutiva",
    price: "$4,800",
    image: "/breitling-navitimer-brown-leather-watch.png",
  },
]

const productGrid = [
  {
    id: 5,
    name: "Tudor Black Bay",
    price: "$3,200",
    image: "/tudor-black-bay-blue-dive-watch.png",
  },
  {
    id: 6,
    name: "Longines Master",
    price: "$2,800",
    image: "/longines-master-white-dial-brown-leather.png",
  },
  {
    id: 7,
    name: "Cartier Santos",
    price: "$6,800",
    image: "/cartier-santos-women-watch-pink.png",
  },
  {
    id: 8,
    name: "Rolex Datejust",
    price: "$7,200",
    image: "/rolex-datejust-women-silver-watch.png",
  },
]

export default function WatchCatalog() {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white">
      {/* Top Section - Two Hero Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[400px]">
        {/* Left Panel - Men's Watches */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full p-8 flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">Relojes para Hombre</h2>
              <p className="text-lg text-slate-300">Más Exclusivos</p>
            </div>

            {/* Watch Grid */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              {featuredWatches.slice(0, 2).map((watch) => (
                <div key={watch.id} className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-2 h-24 flex items-center justify-center">
                    <Image
                      src={watch.image || "/placeholder.svg?height=60&width=60&query=luxury watch"}
                      alt={watch.name}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-xs mb-1">{watch.name}</h3>
                  <p className="text-slate-400 text-xs">{watch.collection}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Women's Collection */}
        <div className="relative bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden mt-10">
          <div className="absolute inset-0">
            <Image src="/elegant-woman-wearing-luxury-watch-fashion-portrai.png" alt="Woman wearing luxury watch" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          </div>
          <div className="relative h-full p-8 flex flex-col justify-center text-white">
            <h2 className="text-2xl font-bold mb-2">Relojes para Mujer</h2>
            <p className="text-lg mb-4">La nueva colección</p>
            <button  className="w-fit">
              Explorar Colección
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[400px]">
        {/* Left Panel - Executive Collection */}
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src=""
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
          </div>
          <div className="relative h-full p-8 flex flex-col justify-center text-white">
            <h2 className="text-2xl font-bold mb-2">Relojes para Hombre</h2>
            <p className="text-lg mb-4">Colección Ejecutiva</p>
            <button  className="w-fit">
              Ver Colección
            </button>
          </div>
        </div>

        {/* Right Panel - Product Grid */}
        <div className="bg-white p-6">
          <div className="grid grid-cols-2 gap-4 h-full">
            {productGrid.map((watch) => (
              <div key={watch.id} className="text-center flex flex-col">
                <div className="bg-slate-50 rounded-lg p-4 mb-2 flex-1 flex items-center justify-center">
                  <Image
                    src={watch.image || "/placeholder.svg?height=80&width=80&query=luxury watch"}
                    alt={watch.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{watch.name}</h3>
                <p className="text-slate-600 text-xs">{watch.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
