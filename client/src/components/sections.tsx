"use client"

import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import useFilterStore, { GenderFilter } from "../stores/filterStore";

interface Section {
  title: string;
  slug: GenderFilter; 
  url: string;
}

export default function Sections() {
  const searchParams = useSearchParams();
  const currentGender = searchParams.get('gender');
  const { setGender } = useFilterStore();

  const sections: Section[] = [
    { title: "Hombres", slug: "Hombre", url: `/products?gender=Hombre` },
    { title: "Mujeres", slug: "Mujer", url: `/products?gender=Mujer` },
    { title: "Niños", slug: "Niños", url: `/products?gender=Niños` },
    { title: "Parejas", slug: "Parejas", url: `/products?gender=Parejas` },
  ];

  return (
    <div className="flex justify-center items-center p-3 border-b border-t border-gray-200 mt-2 w-full">
      <nav className="flex flex-wrap items-center justify-center  gap-3 sm:gap-6 md:gap-20"> 
        {sections.map((section) => {
          const isActive = currentGender === section.slug;

          return (
            <Link key={section.title} href={section.url}>
              <div
                onClick={() => setGender(section.slug as GenderFilter)}
                className={`flex items-center justify-center rounded-md transition-colors px-3 py-2 text-sm sm:text-base ${
                  isActive 
                    ? "bg-gray-200 font-semibold text-gray-900" 
                    : "hover:bg-gray-100"
                }`}
              >
                <span>{section.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
