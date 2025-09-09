"use client";

import { ProductType } from "@/types";
import Image from "next/image";

const ProductCard = ({ product }: { product: ProductType }) => {
  // const { addToCart } = useCartStore();
  // const [isHovered, setIsHovered] = useState(false);
  
  // const handleAddToCart = () => {
  //   addToCart({
  //     ...product,
  //     quantity: 1,
  //   });
  //   toast.success("Producto agregado al carrito");
  // };

  return (
    <div
      className="group transition-all duration-300 overflow-hidden hover:border-primary/30 max-w-sm mx-auto flex flex-col"
    >
      {/* IMAGE SECTION */}
        <div className="relative aspect-[2.4/3] overflow-hidden bg-muted/30">
          <Image
            width={400}
            height={500}
            src={product.imagen || "/placeholder.svg?height=400&width=400&query=modern product image"}
            alt={product.nombre || "Producto"}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>

      {/* CONTENT SECTION */}
      <div className="p-2 flex flex-col flex-grow flex-1">
        {/* Nombre y descripción */}
        <div className="space-y-2">
          <h3 className="font-semibold text-xl text-foreground transition-colors duration-300">
            {product.nombre}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed min-h-[3rem]">
            {product.descripcion}
          </p>
        </div>

        

        {/* BOTÓN al final */}
       
      </div>
    </div>
  );
};

export default ProductCard;
