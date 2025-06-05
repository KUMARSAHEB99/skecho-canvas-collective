
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const featuredArtworks = [
  {
    id: 1,
    title: "Ocean Dreams",
    artist: "Sarah Chen",
    price: 285,
    category: "Abstract",
    likes: 42,
    imageGradient: "from-blue-400 to-cyan-300"
  },
  {
    id: 2,
    title: "Urban Solitude",
    artist: "Marcus Rodriguez",
    price: 450,
    category: "Digital",
    likes: 67,
    imageGradient: "from-gray-600 to-gray-400"
  },
  {
    id: 3,
    title: "Wildflower Symphony",
    artist: "Emma Thompson",
    price: 320,
    category: "Oil Painting",
    likes: 89,
    imageGradient: "from-pink-400 to-yellow-300"
  },
  {
    id: 4,
    title: "Cosmic Dance",
    artist: "Alex Kim",
    price: 380,
    category: "Mixed Media",
    likes: 124,
    imageGradient: "from-skecho-coral to-skecho-coral-dark"
  },
  {
    id: 5,
    title: "Forest Whispers",
    artist: "Maya Patel",
    price: 295,
    category: "Watercolor",
    likes: 76,
    imageGradient: "from-green-400 to-emerald-300"
  },
  {
    id: 6,
    title: "City Lights",
    artist: "David Wilson",
    price: 520,
    category: "Photography",
    likes: 93,
    imageGradient: "from-orange-400 to-skecho-coral"
  }
];

export const FeaturedArtworks = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-skecho-charcoal">Featured Artworks</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exceptional pieces from our most talented artists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredArtworks.map((artwork) => (
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
                      <h3 className="text-xl font-semibold hover:text-skecho-coral-dark transition-colors cursor-pointer">
                        {artwork.title}
                      </h3>
                    </Link>
                    <Link to={`/artist/${artwork.artist.replace(' ', '-').toLowerCase()}`}>
                      <p className="text-gray-600 hover:text-skecho-coral-dark transition-colors cursor-pointer">
                        by {artwork.artist}
                      </p>
                    </Link>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-skecho-coral-light text-skecho-coral-dark px-3 py-1 rounded-full">
                      {artwork.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {artwork.likes}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-skecho-coral">
                      ${artwork.price}
                    </span>
                    <Button size="sm" className="bg-skecho-coral hover:bg-skecho-coral-dark text-white">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/browse">
            <Button size="lg" variant="outline" className="border-skecho-coral text-skecho-coral-dark hover:bg-skecho-coral-light/30">
              View All Artworks
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
