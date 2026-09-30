"use client"

import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import useFilterStore, { GenderFilter } from "../stores/filterStore";

interface Section {
  title: string;
  slug: GenderFilter;
  url: string;
}

interface SectionsProps {
  onLinkClick?: () => void;
}

export default function Sections({ onLinkClick }: SectionsProps) {
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
    <div className="w-full border-y border-gray-200 mt-1 sm:mt-2">
      <nav
        className="mx-auto grid w-full max-w-6xl grid-cols-4 md:flex md:flex-wrap md:items-center md:justify-center md:gap-6 lg:gap-20"
        aria-label="Categorías"
      >
        {sections.map((section) => {
          const isActive = currentGender === section.slug;
          return (
            <Link
              key={section.title}
              href={section.url}
              onClick={() => {
                setGender(section.slug as GenderFilter);
                onLinkClick?.();
              }}
              className={`flex min-h-11 items-center justify-center px-2 py-2.5 text-center text-xs font-medium leading-none whitespace-nowrap transition-colors sm:px-3 sm:text-sm md:min-h-0 md:rounded-md md:px-3 md:py-2 md:text-base ${isActive
                  ? "bg-gray-200 font-semibold text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {section.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
