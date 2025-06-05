
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
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Explore Artworks
                </Button>
              </Link>
              <Link to="/custom">
                <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-50">
                  Commission Custom Art
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">500+</div>
                <div className="text-gray-600">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">2.5k+</div>
                <div className="text-gray-600">Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">1k+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 bg-gradient-to-br from-purple-200 to-blue-200 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-80"></div>
                </div>
                <div className="h-32 bg-gradient-to-br from-orange-200 to-pink-200 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-400 opacity-80"></div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 bg-gradient-to-br from-green-200 to-teal-200 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-400 opacity-80"></div>
                </div>
                <div className="h-48 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 opacity-80"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
