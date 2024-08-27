"use client";
import {useState} from "react";
import ZoomedImage from "@/components/ZoomedImage";
import {centsToDollars} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Product} from "@prisma/client";

const ProductCheckout = ({ product }: { product: Product }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-5">
      <ZoomedImage imgSrc={product.image} />

      <div className="w-full">
        <h1 className="text-2xl md:text-4xl font-bold">
          {product.name}
        </h1>

        <p className="text-muted-foreground text-base">
          ${centsToDollars(product.price)}
        </p>

        <Label className="mt-5 inline-block">Size</Label>
        <Select onValueChange={setSelectedSize}>
          <SelectTrigger className="w-[180px] focus:ring-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className='mt-5 text-white px-5 py-2 rounded-md'
          size={"sm"}
          onClick={() => alert("Bought!" + selectedSize)}
        >
          Buy Now
        </Button>
      </div>
    </div>
  )
}
export default ProductCheckout
