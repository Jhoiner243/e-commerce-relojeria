import useFilterStore from "@/stores/filterStore";
import useSWRInfinite from "swr/infinite";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export function useInfiniteProducts(take = 20, category?: string) {
  const { gender, minPrice, maxPrice } = useFilterStore();

  return useSWRInfinite(
    (index, previousPageData) => {
      // If we've reached the end, stop fetching
      if (previousPageData && !previousPageData.nextCursor) return null;
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('take', take.toString());
      
      if (previousPageData?.nextCursor) {
        params.append('cursor', previousPageData.nextCursor);
      }
      
      // Add filters
      if (gender && gender !== 'All') {
        params.append('gender', gender);
      }
      
      if (minPrice !== null) {
        params.append('minPrice', minPrice.toString());
      }
      
      if (maxPrice !== null) {
        params.append('maxPrice', maxPrice.toString());
      }
      
      if (category) {
        params.append('category', category);
      }
      
      // First page
      if (index === 0) {
        return `${API_BASE_URL}/products?${params.toString()}`;
      }
      
      // Subsequent pages
      return `${API_BASE_URL}/products?${params.toString()}`;
    },
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors (client errors)
        return !error.message.includes('4');
      },
    }
  );
}
