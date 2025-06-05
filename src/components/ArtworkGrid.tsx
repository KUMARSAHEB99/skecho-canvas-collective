
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface ArtworkGridProps {
  category: string;
  priceRange: [number, number];
  sortBy: string;
}

const allArtworks = [
  {
    id: 1,
    title: "Ocean Dreams",
    artist: "Sarah Chen",
    price: 285,
    category: "abstract",
    likes: 42,
    imageGradient: "from-blue-400 to-cyan-300"
  },
  {
    id: 2,
    title: "Urban Solitude",
    artist: "Marcus Rodriguez",
    price: 450,
    category: "digital",
    likes: 67,
    imageGradient: "from-gray-600 to-gray-400"
  },
  {
    id: 3,
    title: "Wildflower Symphony",
    artist: "Emma Thompson",
    price: 320,
    category: "oil-painting",
    likes: 89,
    imageGradient: "from-pink-400 to-yellow-300"
  },
  {
    id: 4,
    title: "Cosmic Dance",
    artist: "Alex Kim",
    price: 380,
    category: "mixed-media",
    likes: 124,
    imageGradient: "from-purple-500 to-indigo-400"
  },
  {
    id: 5,
    title: "Forest Whispers",
    artist: "Maya Patel",
    price: 295,
    category: "watercolor",
    likes: 76,
    imageGradient: "from-green-400 to-emerald-300"
  },
  {
    id: 6,
    title: "City Lights",
    artist: "David Wilson",
    price: 520,
    category: "photography",
    likes: 93,
    imageGradient: "from-orange-400 to-red-400"
  },
  {
    id: 7,
    title: "Abstract Emotions",
    artist: "Lisa Chang",
    price: 180,
    category: "abstract",
    likes: 34,
    imageGradient: "from-purple-400 to-pink-400"
  },
  {
    id: 8,
    title: "Digital Horizon",
    artist: "Tom Baker",
    price: 650,
    category: "digital",
    likes: 156,
    imageGradient: "from-indigo-500 to-blue-500"
  }
];

export const ArtworkGrid = ({ category, priceRange, sortBy }: ArtworkGridProps) => {
  // Filter artworks based on selected filters
  let filteredArtworks = allArtworks.filter(artwork => {
    const categoryMatch = category === "all" || artwork.category === category;
    const priceMatch = artwork.price >= priceRange[0] && artwork.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  // Sort artworks
  filteredArtworks = filteredArtworks.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "popular":
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
            <div className="relative">
              <div className={`h-64 bg-gradient-to-br ${artwork.imageGradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-3">
                <div>
                  <Link to={`/artwork/${artwork.id}`}>
                    <h3 className="text-xl font-semibold hover:text-purple-600 transition-colors cursor-pointer">
                      {artwork.title}
                    </h3>
                  </Link>
                  <Link to={`/artist/${artwork.artist.replace(' ', '-').toLowerCase()}`}>
                    <p className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer">
                      by {artwork.artist}
                    </p>
                  </Link>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    {artwork.category.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Heart className="w-4 h-4" /> {artwork.likes}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-purple-600">
                    ${artwork.price}
                  </span>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
