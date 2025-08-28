import { ProductsType } from "@/types";
import Link from "next/link";
import Categories from "./Categories";
import Filter from "./Filter";
import ProductCard from "./ProductCard";

// TEMPORARY
const products: ProductsType = [
  {
    id: "1",
    name: "Adidas CoreFit T-Shirt",
   
    description:
      "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    price: 39.9,
    categoriaName: "Category 1",
    images:  "/products/1g.png",
  },
  {
    id: "2",
    name: "Puma Ultra Warm Zip",
 
    description:
      "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    price: 59.9,
    categoriaName: "Category 1",
    images:  "/products/2g.png",
  },
  {
    id:" 5",
    name: "Under Armour StormFleece",

    description:
      "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    price: 49.9,
    categoriaName: "Category 1",
    images:  "/products/5r.png",
    
  },
  {
    id: "6",
    name: "Nike Air Max 270",
   
    description:
      "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    price: 59.9,
    categoriaName: "Category 1",

    images:  "/products/6g.png",
  },
  {
    id: "7",
    name: "Nike Ultraboost Pulse ",

    description:
      "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    price: 69.9,
    categoriaName: "Category 1",

    images: "/products/7g.png",
  },
  {
    id: "8",
    name: "Levi’s Classic Denim",
 
    description:
      "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    price: 59.9,
    categoriaName: "Category 1",
    images:  "https://www.midowatches.com/media/catalog/product/M/0/M049.526.37.291.00_0_front_1.png?im=Resize=(50,50),",
  },
];

const ProductList = ({ category,params }: { category: string, params:"homepage" | "products" }) => {
  return (
    <div className="w-full">
      <Categories />
      {params === "products" && <Filter/>}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link
        href={category ? `/products/?category=${category}` : "/products"}
        className="flex justify-end mt-4 underline text-sm text-gray-500"
      >
       Ver todos los productos
      </Link>
    </div>
  );
};

export default ProductList;
