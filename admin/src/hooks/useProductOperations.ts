"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';

interface ProductFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  categoriaName: string;
  productType: string;
  gender?: string;
  imagen?: File | string;
  mayorista?: boolean;
  mayoristaPrice?: number;
  isActive?: boolean;
}

interface UseProductOperationsOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

export const useProductOperations = (options: UseProductOperationsOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { onSuccess, onError, showToast = true } = options;

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    if (!showToast) return;
    
    switch (type) {
      case 'success':
        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        break;
      case 'error':
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        break;
      case 'warning':
        toast.warning(message, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        break;
      case 'info':
        toast.info(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        break;
    }
  };

  const createProduct = async (formData: ProductFormData) => {
    setLoading(true);
    clearMessages();

    try {
      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("descripcion", formData.descripcion);
      data.append("precio", formData.precio.toString());
      data.append("categoriaName", formData.categoriaName);
      data.append("productType", formData.productType);
      
      if (formData.gender) {
        data.append("gender", formData.gender);
      }
      
      if (formData.imagen) {
        if (formData.imagen instanceof File) {
          data.append("imagen", formData.imagen);
        } else {
          data.append("imagen", formData.imagen);
        }
      }
      
      if (formData.mayorista !== undefined) {
        data.append("mayorista", formData.mayorista.toString());
      }
      
      if (formData.mayoristaPrice !== undefined) {
        data.append("mayoristaPrice", formData.mayoristaPrice.toString());
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error del servidor: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const successMessage = "Producto creado exitosamente";
      
      setSuccess(successMessage);
      showNotification(successMessage, 'success');
      
      if (onSuccess) onSuccess();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado al crear el producto";
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      
      if (onError) onError(errorMessage);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, formData: ProductFormData) => {
    setLoading(true);
    clearMessages();

    try {
      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("descripcion", formData.descripcion);
      data.append("precio", formData.precio.toString());
      data.append("categoriaName", formData.categoriaName);
      data.append("productType", formData.productType);
      
      if (formData.gender) {
        data.append("gender", formData.gender);
      }
      
      if (formData.isActive !== undefined) {
        data.append("isActive", formData.isActive.toString());
      }
      
      if (formData.mayorista !== undefined) {
        data.append("mayorista", formData.mayorista.toString());
      }
      
      if (formData.mayoristaPrice !== undefined) {
        data.append("mayoristaPrice", formData.mayoristaPrice.toString());
      }
      
      if (formData.imagen && formData.imagen instanceof File) {
        data.append("imagen", formData.imagen);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: "PATCH",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error del servidor: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const successMessage = "Producto actualizado exitosamente";
      
      setSuccess(successMessage);
      showNotification(successMessage, 'success');
      
      if (onSuccess) onSuccess();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado al actualizar el producto";
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      
      if (onError) onError(errorMessage);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error del servidor: ${response.status}`;
        throw new Error(errorMessage);
      }

      const successMessage = "Producto eliminado exitosamente";
      setSuccess(successMessage);
      showNotification(successMessage, 'success');
      
      if (onSuccess) onSuccess();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado al eliminar el producto";
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      
      if (onError) onError(errorMessage);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    clearMessages();

    try {
      const endpoint = currentStatus ? 'soft-delete' : 'restore';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}/${endpoint}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error del servidor: ${response.status}`;
        throw new Error(errorMessage);
      }

      const successMessage = currentStatus 
        ? "Producto desactivado exitosamente" 
        : "Producto activado exitosamente";
      
      setSuccess(successMessage);
      showNotification(successMessage, 'success');
      
      if (onSuccess) onSuccess();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado al cambiar el estado del producto";
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      
      if (onError) onError(errorMessage);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    clearMessages,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    showNotification,
  };
};
