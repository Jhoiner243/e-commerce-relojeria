"use client"

import useFilterStore from "@/stores/filterStore"

const Filter = () => {
  const { minPrice, maxPrice, sortBy, setMinPrice, setMaxPrice, setSortBy } = useFilterStore()

  return (
    <div className="border-b border-gray-100 pb-6 mb-8 max-w-[500px] w-full">

      {/* contenedor responsive */}
      <div className="flex flex-col md:flex-row flex-1 gap-6 md:gap-8 pt-4">

        {/* Price Range Filter */}
        <div className="space-y-3 w-full md:w-1/2">
          <label className="block text-xs uppercase tracking-wide text-gray-500">Precio</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              placeholder="Min"
              className="flex-1 px-0 py-2 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 bg-transparent text-gray-900 text-sm placeholder:text-gray-400"
              value={minPrice ?? ""}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
            />
            <span className="text-gray-300">—</span>
            <input
              type="number"
              placeholder="Max"
              className="flex-1 px-0 py-2 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 bg-transparent text-gray-900 text-sm placeholder:text-gray-400"
              value={maxPrice ?? ""}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-3 w-full md:w-1/2">
          <label className="block text-xs uppercase tracking-wide text-gray-500">Ordenar</label>
          <select
            name="sort"
            id="sort"
            className="w-full px-0 py-2 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 bg-transparent text-gray-900 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "none" | "asc" | "desc")}
          >
            <option value="none">Relevancia</option>
            <option value="asc">Precio ↑</option>
            <option value="desc">Precio ↓</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Filter
