import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ProductCards from "@/components/landing/ProductCards";
import AudienceSection from "@/components/landing/AudienceSection";
import StatsSection from "@/components/landing/StatsSection";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";
export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
       <HowItWorks />
       <ProductCards />
       <AudienceSection />
        <StatsSection />
        <Testimonials />
        <Footer />
    </>
  );
}