import BaseLayout from "@/components/BaseLayout";
import UnderlinedText from "@/components/decorators/UnderlinedText";
import MerchProducts from "@/app/merch/MerchProducts";

const Page = () => {
  return (
    <BaseLayout renderRightPanel={false}>
      <div className="px-3 md:px-10 my-10">
        <h1 className="text-3xl text-center my-5 font-bold tracking-tight">
          Our <UnderlinedText className="decoration-wavy">Products</UnderlinedText>
        </h1>

        <MerchProducts />
      </div>
    </BaseLayout>
  )
}
export default Page
