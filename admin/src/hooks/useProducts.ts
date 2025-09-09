"use client"
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Product } from '../app/products/columns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/products/all`);
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const softDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/soft-delete`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Error al desactivar producto';
        throw new Error(errorMessage);
      }
      await fetchProducts(); // Refresh the list
      toast.success('Producto desactivado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const restoreProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/restore`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Error al restaurar producto';
        throw new Error(errorMessage);
      }
      await fetchProducts(); // Refresh the list
      toast.success('Producto restaurado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Error al eliminar producto';
        throw new Error(errorMessage);
      }
      await fetchProducts(); // Refresh the list
      toast.success('Producto eliminado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refreshProducts = () => {
    fetchProducts();
  };

  return { 
    products, 
    loading, 
    error, 
    refreshProducts, 
    softDeleteProduct, 
    restoreProduct, 
    deleteProduct 
  };
};
