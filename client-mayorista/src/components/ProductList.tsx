"use client";
import useFilterStore from "@/stores/filterStore";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useInfiniteProducts } from "../hooks/use-infinity-scroll";
import Filter from "./Filter";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./ProductCard";

const ProductList = ({ category, params }: { category: string, params: "homepage" | "products" }) => {
  const { sortBy, setGender } = useFilterStore();
  const { data, size, setSize, isValidating, error, isLoading } = useInfiniteProducts(20, category);

  // const products = data ? data.flatMap((page) => page.items) : [];
  const hasMore = data?.[data.length - 1]?.nextCursor;

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(params === "homepage") {
      setGender("All")
    }
  }, [params, setGender])

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

// Aplicar solo la clasificación (el filtrado ahora se realiza en el backend)
  const sortedProducts = useMemo(() => {
    if (!data) return [];
    
    const products = data.flatMap((page) => page.items);
    let sorted = [...products];

    // Apply sorting
    if (sortBy === "asc") {
      sorted = sorted.sort((a, b) => a.precio - b.precio);
    } else if (sortBy === "desc") {
      sorted = sorted.sort((a, b) => b.precio - a.precio);
    }

    return sorted;
  }, [data, sortBy]);

  // Show loading spinner on initial load
  if (isLoading) {
    return (
      <div className="w-full mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
        { params === "homepage" ? null : (
          <div className="justify-items-end">
          <Filter />
          </div>
        )
        }
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" text="Cargando productos..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
        { params === "homepage" ? null : (
          <div className="justify-items-end">
          <Filter />
          </div>
        )
        }
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error al cargar los productos</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
        { params === "homepage" ? null : (
          <div className="justify-items-end p-2">
          <Filter />
          </div>
        )
        }
      
      {sortedProducts.length === 0 && !isValidating ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg text-gray-600 mb-4">No se encontraron productos</div>
            <p className="text-sm text-gray-500">
              Intenta ajustar los filtros o busca en otra categoría
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {sortedProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* Load More Indicator */}
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center items-center py-8">
              {isValidating ? (
                <LoadingSpinner size="md" text="Cargando más productos..." />
              ) : (
                <div className="text-gray-500">Scroll para cargar más productos</div>
              )}
            </div>
          )}

          {/* Show "Ver todos los productos" link only on homepage */}
          {params === "homepage" && sortedProducts.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos los productos
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
