"use client";
import { useCategories } from "@/hooks/useCategories";
import {
    Shirt,
    ShoppingBasket
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const defaultCategories = [
  {
    name: "All",
    icon: <ShoppingBasket className="w-4 h-4" />,
    slug: "all",
  }
];

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { categories, loading } = useCategories();

  const selectedCategory = searchParams.get("category");

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value || "all");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Combinar categorías por defecto con las del backend
  const allCategories = [
    ...defaultCategories,
    ...categories.map((cat) => ({
      name: cat.nombre,
      icon: <Shirt className="w-4 h-4" />,
      slug: cat.id,
    }))
  ];

  if (loading) {
    return (
      <div className="flex gap-2 bg-gray-100 p-2 mb-4 text-sm">
        <div className="flex flex-1 items-center justify-center gap-2 px-2 py-1 text-gray-500">
          Cargando categorías...
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 bg-gray-100 p-2 mb-4 text-sm">
      {allCategories.map((category) => (
        <div
          className={`flex flex-1 items-center justify-center gap-2 cursor-pointer px-2 py-1 ${
            category.slug === selectedCategory ? "bg-white" : "text-gray-500"
          }`}
          key={category.name}
          onClick={() => handleChange(category.slug)}
        >
          {category.icon}
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default Categories;
