"use client";

import useFilterStore from "@/stores/filterStore";

const Filter = () => {
  const { gender, minPrice, maxPrice, sortBy, setGender, setMinPrice, setMaxPrice, setSortBy } = useFilterStore();

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-gray-700 my-6">
      <div className="flex items-center gap-2">
        <span>Género:</span>
        <select
          name="gender"
          id="gender"
          className="ring-1 ring-gray-200 shadow-md p-1 rounded-sm"
          value={gender}
          onChange={(e) => setGender(e.target.value as any)}
        >
          <option value="all">Todos</option>
          <option value="men">Hombre</option>
          <option value="women">Mujer</option>
          <option value="kids">Niños</option>
          <option value="couples">Parejas</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span>Precio:</span>
        <input
          type="number"
          placeholder="Mín"
          className="w-20 ring-1 ring-gray-200 shadow-md p-1 rounded-sm"
          value={minPrice ?? ""}
          onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Máx"
          className="w-20 ring-1 ring-gray-200 shadow-md p-1 rounded-sm"
          value={maxPrice ?? ""}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <div className="flex items-center gap-2">
        <span>Orden:</span>
        <select
          name="sort"
          id="sort"
          className="ring-1 ring-gray-200 shadow-md p-1 rounded-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="none">Sin orden</option>
          <option value="asc">Precio: Menor a Mayor</option>
          <option value="desc">Precio: Mayor a Menor</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
