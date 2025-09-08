"use client"
import ProductInteraction from "@/components/ProductInteraction";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProductType } from "../../../types";
import { formatCurrency } from "../../../utils/format-currency";

const ProductPage =    ({ params }: { params: { id: string } }) => {
  const { id } =  params;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3003/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Error al cargar producto");
        }

        const data: ProductType = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
      {/* IMAGE */}
      <div className="w-full lg:w-5/12 relative aspect-[2/3]">
        <Image
          src={product.imagen || "/fallback.jpg"}
          alt={product.nombre}
          fill
          className="object-contain rounded-md"
        />
      </div>
      {/* DETAILS */}
      <div className="w-full lg:w-6/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.nombre}</h1>
        <p className="text-gray-500">{product.descripcion}</p>
        <h2 className="text-2xl font-semibold">
          {product.precio ? formatCurrency(product.precio) : "N/A"}
        </h2>
        <ProductInteraction product={product} />
      </div>
    </div>
  );
};

export default ProductPage;
