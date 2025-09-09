"use client"
import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductWhatsAppButton from "../../../components/ProductWhatsAppButton";
import { formatCurrency } from "../../../utils/format-currency";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
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

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity: 1,
      });
      toast.success("Producto agregado al carrito");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Producto no encontrado</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/products" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a productos
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* IMAGE SECTION */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}
                <Image
                  src={product.imagen || "/fallback.jpg"}
                  alt={product.nombre}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              

            </div>

            {/* DETAILS SECTION */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.nombre}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(5.0)</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-b border-gray-200 pb-4">
                <p className="text-4xl font-bold text-gray-900">
                  {product.precio ? formatCurrency(product.precio) : "N/A"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Precio incluye IVA
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.descripcion}
                </p>
              </div>

              {/* Product details */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Genero</p>
                  <p className="font-medium">{product.gender}</p>
                </div>

                {product.reference && (
                  <div>
                    <p className="text-sm text-gray-500">Referencia</p>
                    <p className="font-medium">{product.reference}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al carrito
                </button>
                
                <ProductWhatsAppButton
                  phone="573001112233"
                  imageUrl={product.imagen}
                  productName={product.nombre}
                  reference={product.reference}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                />
              </div>

 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
