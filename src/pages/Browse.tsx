
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { ArtworkFilters } from "@/components/ArtworkFilters";
import { useState } from "react";

const Browse = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("newest");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Artworks</h1>
          <p className="text-xl text-gray-600">Discover unique pieces from talented independent artists</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ArtworkFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ArtworkGrid
              category={selectedCategory}
              priceRange={priceRange}
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Browse;
