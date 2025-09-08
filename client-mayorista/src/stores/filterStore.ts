"use client";

import { create } from "zustand";

export type GenderFilter = "All" | "Hombre" | "Mujer" | "Niños" | "Parejas";
export type SortOption = "none" | "asc" | "desc" | "newest" | "oldest";

type FilterState = {
  gender: GenderFilter;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: SortOption;
};

type FilterActions = {
  setGender: (gender: GenderFilter) => void;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  setSortBy: (sort: SortOption) => void;
  reset: () => void;
};

const initialState: FilterState = {
  gender: "All",
  minPrice: null,
  maxPrice: null,
  sortBy: "none",
};

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,
  setGender: (gender) => set({ gender }),
  setMinPrice: (value) => set({ minPrice: value }),
  setMaxPrice: (value) => set({ maxPrice: value }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () => set(initialState),
}));

export default useFilterStore;


