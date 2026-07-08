import { useEffect, useState } from 'react';

export type Category = {
  id: string;
  nombre: string;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3003/api/categorias');
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refreshCategories = () => {
    fetchCategories();
  };

  return { categories, loading, error, refreshCategories };
};
