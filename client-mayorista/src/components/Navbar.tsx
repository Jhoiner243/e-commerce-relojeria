"use client";

import { Home, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import AnnouncementBanner from "./AnnouncementBanner";
import Sections from "./sections";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      <AnnouncementBanner />

      <nav className="w-full flex items-center justify-between pb-4 mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl py-4">
        {/* LEFT */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="guaca" width={36} height={36} />
          <p className="hidden md:block text-md font-medium tracking-wider ml-2">
            La guaca del reloj
          </p>
        </Link>
        
        {/* RIGHT - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/">
            <Home className="w-5 h-5 text-gray-600"/>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-2">
            <Link 
              href="/" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-4 h-4 text-gray-600"/>
              <span>Inicio</span>
            </Link>
            <Link 
              href="/cart" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
             
            </Link>
          </div>
        </div>
      )}

      {/* Sections - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block">
        <Suspense fallback={<div className="flex justify-center items-center p-3 border-b border-t border-gray-200 mt-2 w-full"><div className="text-sm text-gray-500">Loading...</div></div>}>
          <Sections />
        </Suspense>
      </div>

      {/* Mobile Sections */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-50 border-b border-gray-200">
          <div className="px-4 py-3">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/products?gender=Hombre" 
                className="p-2 rounded-md hover:bg-gray-100 transition-colors text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hombres
              </Link>
              <Link 
                href="/products?gender=Mujer" 
                className="p-2 rounded-md hover:bg-gray-100 transition-colors text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mujeres
              </Link>
              <Link 
                href="/products?gender=Niños" 
                className="p-2 rounded-md hover:bg-gray-100 transition-colors text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Niños
              </Link>
              <Link 
                href="/products?gender=Parejas" 
                className="p-2 rounded-md hover:bg-gray-100 transition-colors text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Parejas
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
