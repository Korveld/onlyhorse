import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DollarSign} from "lucide-react";
import {centsToDollars, cn} from "@/lib/utils";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import ZoomedImage from "@/components/ZoomedImage";
import {Product} from "@prisma/client";

const SuggestedProduct = ({ product }: { product: Product }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="px-2 flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-sm font-medium">
          <p className="w-28 text-ellipsis overflow-hidden text-nowrap">
            {product.name}
          </p>
        </CardTitle>

        <div>
          <DollarSign className="inline w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{centsToDollars(product.price)}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-2 p-2">
        <ZoomedImage className={"h-44"} imgSrc={product.image} />
        <div className="flex justify-center mt-auto">
          <Link
            href={`/merch/${product.id}`}
            className={cn("w-full", buttonVariants({
              size: 'sm'
            }))}
          >
            Buy
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
export default SuggestedProduct
