import ProductList from "@/components/ProductList";
import CarruselPromotions from "../components/carrusel";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
  return (
    <div className="">
      <div className="relative w-full mb-10">
      <CarruselPromotions />

      </div>
      <ProductList category={category} params="homepage"/>
    </div>
  );
};

export default Homepage;
