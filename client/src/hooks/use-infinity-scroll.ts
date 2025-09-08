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

export function useInfiniteProducts(take = 20) {
  return useSWRInfinite(
    (index, previousPageData) => {
      // If we've reached the end, stop fetching
      if (previousPageData && !previousPageData.nextCursor) return null;
      
      // First page
      if (index === 0) {
        return `${API_BASE_URL}/products?take=${take}`;
      }
      
      // Subsequent pages
      return `${API_BASE_URL}/products?take=${take}&cursor=${previousPageData.nextCursor}`;
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
