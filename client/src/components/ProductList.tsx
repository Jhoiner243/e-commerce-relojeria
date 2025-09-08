"use client";
import useFilterStore from "@/stores/filterStore";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useInfiniteProducts } from "../hooks/use-infinity-scroll";
import Filter from "./Filter";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./ProductCard";

const ProductList = ({ category, params }: { category: string, params: "homepage" | "products" }) => {
  const { gender, minPrice, maxPrice, sortBy } = useFilterStore();

  const { data, size, setSize, isValidating, error, isLoading } = useInfiniteProducts(20);

  const products = data ? data.flatMap((page) => page.items) : [];
  const hasMore = data?.[data.length - 1]?.nextCursor;

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isValidating) {
          setSize(size + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isValidating, size, setSize]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products
      .filter((p) => (gender === "all" ? true : p.gender === gender))
      .filter((p) => (minPrice != null ? p.precio >= minPrice : true))
      .filter((p) => (maxPrice != null ? p.precio <= maxPrice : true))
      .filter((p) => (category ? p.categoriaName === category : true));

    // Apply sorting
    if (sortBy === "asc") {
      filtered = [...filtered].sort((a, b) => a.precio - b.precio);
    } else if (sortBy === "desc") {
      filtered = [...filtered].sort((a, b) => b.precio - a.precio);
    }

    return filtered;
  }, [products, gender, minPrice, maxPrice, category, sortBy]);

  // Show loading spinner on initial load
  if (isLoading) {
    return (
      <div className="w-full mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
        <Filter />
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" text="Cargando productos..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
        <Filter />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error al cargar los productos</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
      <Filter />
      
      {filteredAndSortedProducts.length === 0 && !isValidating ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">No se encontraron productos</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-12">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Show "Ver todos los productos" link only on homepage */}
          {params === "homepage" && (
            <Link
              href={category ? `/products/?category=${category}` : "/products"}
              className="flex justify-center mt-8 underline text-sm text-gray-500"
            >
              Ver todos los productos
            </Link>
          )}
        </>
      )}

      {/* Infinite scroll loader */}
      {hasMore && (
        <div ref={loaderRef} className="py-8 text-center">
          {isValidating ? (
            <LoadingSpinner text="Cargando más productos..." />
          ) : (
            <div className="text-gray-500">Desliza para cargar más</div>
          )}
        </div>
      )}

      {/* Show end message when no more products */}
      {!hasMore && filteredAndSortedProducts.length > 0 && (
        <div className="py-8 text-center">
          <div className="text-gray-500">No hay más productos para mostrar</div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
