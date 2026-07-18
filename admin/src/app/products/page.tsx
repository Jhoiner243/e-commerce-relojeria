"use client";

import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { useDebounce } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import AddProduct from "../../components/AddProduct";
import { useProducts } from "../../hooks/useProducts";
import { formatCurrency } from "../../lib/format-currency";
import { createColumns, Product } from "./columns";
import { DataTable } from "./data-table";

const ProductsPage = () => {
  const { products, error, loading, softDeleteProduct, restoreProduct, deleteProduct } = useProducts();

  const searchParams = useSearchParams();
  const { replace, push } = useRouter();

  // Estado de búsqueda (controlado desde la URL)
  const [searchParam, setSearchParam] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(searchParam, 400);

  // Estado de paginación (controlado desde la URL)
  const [pageIndex, setPageIndex] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 0;
  });
  const [pageSize, setPageSize] = useState(() => {
    const size = searchParams.get("pageSize");
    return size ? parseInt(size, 10) : 10;
  });

  // Actualiza la URL cuando cambia la búsqueda
  useEffect(() => {
    const query = debouncedSearch.trim();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (pageIndex > 0) params.set("page", pageIndex.toString());
    if (pageSize !== 10) params.set("pageSize", pageSize.toString());
    const newPath = params.toString() ? `/products?${params.toString()}` : `/products`;
    replace(newPath, { scroll: false });
  }, [debouncedSearch, pageIndex, pageSize, replace]);

  // Función para navegar preservando todos los parámetros
  const navigateWithParams = useCallback((path: string) => {
    const params = new URLSearchParams();
    const query = debouncedSearch.trim();
    if (query) params.set("q", query);
    if (pageIndex > 0) params.set("page", pageIndex.toString());
    if (pageSize !== 10) params.set("pageSize", pageSize.toString());
    const newPath = params.toString() ? `${path}?${params.toString()}` : path;
    push(newPath);
  }, [debouncedSearch, pageIndex, pageSize, push]);

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
        precioBarranquilla: product.precioBarranquilla || null,
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
          mayoristaPrice: isWholesale ? 0 : 0,
        }),
      });
      
      if (response.ok) {
        // Refresh the products list preserving pagination state
        navigateWithParams("/products");
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
    paginationParams: (() => {
      const params = new URLSearchParams();
      const q = debouncedSearch.trim();
      if (q) params.set("q", q);
      if (pageIndex > 0) params.set("page", pageIndex.toString());
      if (pageSize !== 10) params.set("pageSize", pageSize.toString());
      const str = params.toString();
      return str ? `?${str}` : "";
    })(),
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
        <DataTable 
          columns={columns} 
          data={productsMap} 
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageIndexChange={setPageIndex}
          onPageSizeChange={setPageSize}
        />
      </div>

      <DialogContent>
        <AddProduct searchParams={searchParams} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductsPage;
