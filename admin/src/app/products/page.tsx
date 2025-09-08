"use client";

import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { useDebounce } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AddProduct from "../../components/AddProduct";
import { useProducts } from "../../hooks/useProducts";
import { formatCurrency } from "../../lib/format-currency";
import { createColumns, Product } from "./columns";
import { DataTable } from "./data-table";

const ProductsPage = () => {
  const { products, error, loading, softDeleteProduct, restoreProduct, deleteProduct } = useProducts();

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // Estado de búsqueda (controlado desde la URL)
  const [searchParam, setSearchParam] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(searchParam, 400);

  // Actualiza la URL cuando cambia el debounce
  useEffect(() => {
    const query = debouncedSearch.trim();
    const newPath = query ? `/products?q=${encodeURIComponent(query)}` : `/products`;
    replace(newPath, { scroll: false });
  }, [debouncedSearch, replace]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProductos() {
      if (!debouncedSearch.trim()) {
        setFilteredProducts(products || []);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/search?q=${encodeURIComponent(debouncedSearch)}`
        );
        if (!response.ok) throw new Error("Error en la API");
        const data = await response.json();
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error buscando productos:", err);
        setFilteredProducts([]);
      }
    }
    fetchProductos();
  }, [debouncedSearch, products]);

  // Transformación con useMemo para no recalcular en cada render
  const productsMap = useMemo(
    () =>
      (filteredProducts || []).map((product) => ({
        ...product,
        precio: formatCurrency(product.precio),
      })),
    [filteredProducts]
  );

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParam(e.target.value);
  };

  const handleSoftDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres desactivar este producto?")) {
      await softDeleteProduct(id);
    }
  };

  const handleRestore = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres activar este producto?")) {
      await restoreProduct(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "¿Estás seguro de que quieres eliminar este producto permanentemente? Esta acción no se puede deshacer."
      )
    ) {
      await deleteProduct(id);
    }
  };

  const handleToggleWholesale = async (id: string, isWholesale: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}/wholesale`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mayorista: isWholesale,
          mayoristaPrice: isWholesale ? 0 : 0, // Will be set properly in edit form
        }),
      });
      
      if (response.ok) {
        // Refresh the products list
        window.location.reload();
      } else {
        alert('Error al actualizar el estado mayorista');
      }
    } catch {
      alert('Error al actualizar el estado mayorista');
    }
  };

  const columns = createColumns({
    onSoftDelete: handleSoftDelete,
    onRestore: handleRestore,
    onDelete: handleDelete,
    onToggleWholesale: handleToggleWholesale,
  });

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading) return <p>Cargando productos...</p>;

  return (
    <Dialog>
      <div>
        {/* Search */}
        <div className="mb-8 px-4 py-2 flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar producto"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
            value={searchParam}
            onChange={handleSearch}
          />
        </div>

        {/* Header */}
        <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
          <h1 className="font-semibold">Gestión de Productos</h1>

          <DialogTrigger asChild>
            <button className="flex items-center gap-2 m-2 hover:bg-primary/10 p-2 rounded-md">
              <Plus className="size-4" />
              Agregar producto
            </button>
          </DialogTrigger>
        </div>

        {/* Tabla */}
        <DataTable columns={columns} data={productsMap} />
      </div>

      <DialogContent>
        <AddProduct />
      </DialogContent>
    </Dialog>
  );
};

export default ProductsPage;
