import ProductList from "@/components/ProductList";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
  // 2. Obtener los parámetros de búsqueda de la URL actual

  return (
    <div className="">
      <ProductList category={category} params="products"/>
    </div>
  );
};

export default ProductsPage;
