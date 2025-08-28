"use client";
import { products } from "@/data/products";
import useFilterStore from "@/stores/filterStore";
import Link from "next/link";
import Filter from "./Filter";
import ProductCard from "./ProductCard";

const ProductList = ({ category,params }: { category: string, params:"homepage" | "products" }) => {
  const { gender, minPrice, maxPrice, sortBy } = useFilterStore();

  const filtered = products
    .filter((p) => (gender === "all" ? true : p.gender === gender))
    .filter((p) => (minPrice != null ? p.price >= minPrice : true))
    .filter((p) => (maxPrice != null ? p.price <= maxPrice : true));

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "asc") return a.price - b.price;
    if (sortBy === "desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="w-full mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
      {params === "products" && <Filter/>}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-12">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link
        href={category ? `/products/?category=${category}` : "/products"}
        className="flex justify-end mt-4 underline text-sm text-gray-500"
      >
       Ver todos los productos
      </Link>
    </div>
  );
};

export default ProductList;
