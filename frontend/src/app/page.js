import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import VideoSection from "@/components/landing/VideoSection";
import ProductCards from "@/components/landing/ProductCards";
import AudienceSection from "@/components/landing/AudienceSection";
import MiniCRMSection from "@/components/landing/MiniCRMSection";
import StatsSection from "@/components/landing/StatsSection";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <HowItWorks />
      <VideoSection />
      <ProductCards />
      <AudienceSection />
      <MiniCRMSection />
      <StatsSection />
      <Testimonials />
      <Footer />
    </>
  );
}