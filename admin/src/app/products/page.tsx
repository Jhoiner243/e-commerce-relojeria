"use client"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProducts } from "../../hooks/useProducts";
import { formatCurrency } from "../../lib/format-currency";
import { columns, Product } from "./columns";
import { DataTable } from "./data-table";

const ProductsPage = () => {
  const { products, error, loading, softDeleteProduct, restoreProduct, deleteProduct } = useProducts();

  const productsMap: Product[] = products.map((product) => ({
    ...product,
    precio: formatCurrency(product.precio),
  }));

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
        <h1 className="font-semibold">Gestión de Productos</h1>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={productsMap} />
    </div>
  );
};

export default ProductsPage;
