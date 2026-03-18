"use client";

import { Home, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import AnnouncementBanner from "./AnnouncementBanner";
import Sections from "./sections";
import ShoppingCartIcon from "./ShoppingCartIcon";
import CartModal from "./CartModal";
import { useCartModal } from "@/contexts/CartModalContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isCartOpen, closeCart } = useCartModal();

  // Cierra el menú si la pantalla crece a md o más
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Bloquea scroll cuando menú abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div>
      <AnnouncementBanner />

      {/* Barra principal */}
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 mx-auto max-w-6xl py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <Image src="/logo.png" alt="La guaca del reloj" width={36} height={36} priority />
          <span className="hidden sm:block text-sm font-semibold tracking-wide">
            La guaca del reloj
          </span>
        </Link>

        {/* Desktop: iconos derechos */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" aria-label="Inicio">
            <Home className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors" />
          </Link>
          <ShoppingCartIcon />
        </div>

        {/* Mobile: botón hamburguesa & Cart */}
        <div className="md:hidden flex items-center gap-4">
          <ShoppingCartIcon />
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Secciones de categorías — desktop siempre visible */}
      <div className="hidden md:block">
        <Suspense fallback={
          <div className="flex justify-center items-center p-3 border-b border-t border-gray-200 w-full">
            <div className="text-sm text-gray-500">Cargando...</div>
          </div>
        }>
          <Sections onLinkClick={() => setIsOpen(false)} />
        </Suspense>
      </div>

      {/* Overlay oscuro */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menú móvil deslizable */}
      <div
        className={`
          md:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-50
          shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-hidden={!isOpen}
      >
        {/* Cabecera del drawer */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Image src="/logo.png" alt="La guaca del reloj" width={28} height={28} />
            <span className="text-sm font-semibold tracking-wide">La guaca del reloj</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegación principal */}
        <nav className="px-3 py-4 space-y-1">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Home className="w-4 h-4 text-gray-500" />
            Inicio
          </Link>
        </nav>

        {/* Divisor */}
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categorías</p>
        </div>

        {/* Secciones (categorías) en móvil */}
        <Suspense fallback={
          <div className="px-4 py-2 text-sm text-gray-400">Cargando categorías...</div>
        }>
          <Sections onLinkClick={() => setIsOpen(false)} mobile />
        </Suspense>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default Navbar;
