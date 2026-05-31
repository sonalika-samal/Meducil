import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { TopMedicines } from "@/components/home/TopMedicines";
import { SpecialOffers } from "@/components/home/SpecialOffers";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FAQSection";

export default function Home() {
  return (
    <div className="-mt-20">
      <HeroCarousel />
      <CategoryGrid />
      <TopMedicines />
      <SpecialOffers />
      <Testimonials />
      <FAQSection />
    </div>
  );
}


