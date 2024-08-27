"use client"
import {useQuery} from "@tanstack/react-query";
import {getLiveProductsAction} from "@/app/secret-dashboard/actions";
import ProductCard from "@/components/ProductCard";
import {Product} from "@prisma/client";

const MerchProducts = () => {
  const {data: products, isLoading} = useQuery({
    queryKey: ["getLiveProducts"],
    queryFn: async () => getLiveProductsAction(),
  });

  return (
    <>
      {products && !isLoading && (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <>
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </>
        </div>
      )}
      {/*{isLoading && (
        <div className="w-full flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-10 h-10 animate-[spin_1500ms_linear_infinite] text-muted-foreground"/>
            <h3 className="text-xl font-bold">Loading...</h3>
            <p>Please wait...</p>
          </div>
        </div>
      )}*/}
    </>
  )
}
export default MerchProducts
