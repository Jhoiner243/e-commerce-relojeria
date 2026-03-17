"use client";

import { ReactNode } from "react";
import { CartModalProvider } from "@/contexts/CartModalContext";

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CartModalProvider>
      {children}
    </CartModalProvider>
  );
}
