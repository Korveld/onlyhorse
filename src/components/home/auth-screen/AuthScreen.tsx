import HeroSection from "@/components/home/auth-screen/HeroSection";
import TodaysHighlight from "@/components/home/auth-screen/TodaysHighlight";
import MasonryGrid from "@/components/home/auth-screen/MasonryGrid";
import UnderlinedText from "@/components/decorators/UnderlinedText";
import RotatedText from "@/components/decorators/RotatedText";
import Features from "@/components/home/auth-screen/Features";
import Testimonials from "@/components/home/auth-screen/Testimonials";
import Pricing from "@/components/Pricing";
import Team from "@/components/home/auth-screen/Team";

const AuthScreen = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <div className="mb-20 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-3xl md:text-5xl tracking-tight mt-4 mb-8 font-semibold text-center">
            Today's{" "}
            <UnderlinedText className="underline-offset-8 md:underline-offset-[12px] decoration-wavy">
              Highlight
            </UnderlinedText>
            <span className="text-2xl md:text-4xl ml-1">👇</span>
          </p>

          {/*Featured post*/}
          <div className="flex flex-col gap-10 mt-10">
            <TodaysHighlight />

            <div className="mt-24">
              <p className="text-2xl md:text-5xl text-center tracking-tighter font-bold">
                Meet the <RotatedText>Stars</RotatedText> of Our Farm
              </p>

              <MasonryGrid />
              <Features />
              <Testimonials />
              <Pricing />
              <Team />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
