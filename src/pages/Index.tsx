
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FeaturedArtworks } from "@/components/FeaturedArtworks";
import { ArtistSpotlight } from "@/components/ArtistSpotlight";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <Navigation />
      <Hero />
      <FeaturedArtworks />
      <ArtistSpotlight />
      <Footer />
    </div>
  );
};

export default Index;
