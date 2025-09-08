"use client"
import { useEffect, useState } from 'react';
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
        throw new Error('Error al desactivar producto');
      }
      await fetchProducts(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  const restoreProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/restore`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Error al restaurar producto');
      }
      await fetchProducts(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }
      await fetchProducts(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
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
