import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { ArtworkFilters } from "@/components/ArtworkFilters";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  isAvailable: boolean;
  createdAt: string;
  seller: {
    id: string;
    user: {
      name: string;
      email: string;
    }
  };
  categories: Array<{
    id: string;
    name: string;
  }>;
}

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get("minPrice") || "0"),
    parseInt(searchParams.get("maxPrice") || "1000")
  ]);
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "newest");
  const [availability, setAvailability] = useState<boolean>(searchParams.get("available") === "true");

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (priceRange[0] !== 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] !== 1000) params.set("maxPrice", priceRange[1].toString());
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (availability) params.set("available", "true");
    setSearchParams(params);
  }, [selectedCategory, priceRange, sortBy, availability, setSearchParams]);

  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery<{ products: Product[]; total: number }>({
    queryKey: ['products', selectedCategory, priceRange, sortBy, availability],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (priceRange[0] !== 0) params.set("minPrice", priceRange[0].toString());
      if (priceRange[1] !== 1000) params.set("maxPrice", priceRange[1].toString());
      if (availability) params.set("isAvailable", "true");
      
      // Add sorting
      switch (sortBy) {
        case "oldest":
          params.set("orderBy", "createdAt");
          params.set("order", "asc");
          break;
        case "price-low":
          params.set("orderBy", "price");
          params.set("order", "asc");
          break;
        case "price-high":
          params.set("orderBy", "price");
          params.set("order", "desc");
          break;
        default: // newest
          params.set("orderBy", "createdAt");
          params.set("order", "desc");
      }

      const response = await axios.get(`http://localhost:3000/api/products?${params.toString()}`);
      return response.data;
    }
  });

  const handleReset = () => {
    setSelectedCategory("all");
    setPriceRange([0, 1000]);
    setSortBy("newest");
    setAvailability(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-skecho-charcoal">Browse Artworks</h1>
          <p className="text-xl text-gray-600">
            {isLoading ? (
              <Skeleton className="h-8 w-96" />
            ) : (
              `Discover ${productsData?.total || 0} unique pieces from talented independent artists`
            )}
          </p>
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
              availability={availability}
              onAvailabilityChange={setAvailability}
              onReset={handleReset}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ArtworkGrid
              products={productsData?.products}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Browse;
