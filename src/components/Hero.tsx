
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Discover{" "}
                <span className="text-skecho-coral">
                  Unique Art
                </span>{" "}
                by Independent Artists
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Connect directly with talented artists. Buy ready-made masterpieces or commission custom artwork tailored just for you.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/browse">
                <Button size="lg" className="bg-skecho-coral hover:bg-skecho-coral-dark text-white">
                  Explore Artworks
                </Button>
              </Link>
              <Link to="/custom">
                <Button size="lg" variant="outline" className="border-skecho-coral text-skecho-coral-dark hover:bg-skecho-coral-light/30">
                  Commission Custom Art
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-skecho-coral">500+</div>
                <div className="text-gray-600">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-skecho-coral">2.5k+</div>
                <div className="text-gray-600">Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-skecho-coral">1k+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 bg-gradient-to-br from-skecho-coral-light to-skecho-coral rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-skecho-coral/60 to-skecho-coral-dark/60"></div>
                </div>
                <div className="h-32 bg-gradient-to-br from-orange-200 to-skecho-coral-light rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-orange-400/60 to-skecho-coral/60"></div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 bg-gradient-to-br from-green-200 to-teal-200 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-green-400/60 to-teal-400/60"></div>
                </div>
                <div className="h-48 bg-gradient-to-br from-skecho-coral-light to-skecho-coral rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-skecho-coral/60 to-skecho-coral-dark/60"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
