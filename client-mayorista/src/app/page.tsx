import ProductList from "@/components/ProductList";
import PromotionsCarousel from "@/components/PromotionsCarousel";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
  return (
    <div className="space-y-8">
      <div className="relative w-full mb-10">
        <PromotionsCarousel />
      </div>
      <ProductList category={category} params="homepage"/>
    </div>
  );
};

export default Homepage;
