import ProductInteraction from "@/components/ProductInteraction";
import { products } from "@/data/products";
import Image from "next/image";


const ProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = await params
  const product = products.find((p) => p.id === id.id);

  if(!product) return <div>Product not found</div>;

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12 ">
      {/* IMAGE */}
      <div className="w-full lg:w-5/12 relative aspect-[2/3]">
        <Image
          src={product.images}
          alt={product.name}
          fill
          className="object-contain rounded-md"
        />
      </div>
      {/* DETAILS */}
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <h2 className="text-2xl font-semibold">${product.price.toFixed(2)}</h2>
        <ProductInteraction

          product={product}
        />
        {/* CARD INFO */}
      
        <p className="text-gray-500 text-xs">
          By clicking Pay Now, you agree to our{" "}
          <span className="underline hover:text-black">Terms & Conditions</span>{" "}
          and <span className="underline hover:text-black">Privacy Policy</span>
          . You authorize us to charge your selected payment method for the
          total amount shown. All sales are subject to our return and{" "}
          <span className="underline hover:text-black">Refund Policies</span>.
        </p>
      </div>
    </div>
  );
};

export default ProductPage;
