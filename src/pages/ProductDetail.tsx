import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Share2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// This would typically come from an API
const allArtworks = [
  {
    id: 1,
    title: "Ocean Dreams",
    artist: "Sarah Chen",
    price: 285,
    category: "abstract",
    likes: 42,
    imageGradient: "from-blue-400 to-cyan-300",
    description: "A mesmerizing piece that captures the essence of ocean waves and their eternal dance. Created using a unique blend of acrylics and metallic pigments.",
    dimensions: "24\" x 36\"",
    medium: "Acrylic on Canvas",
    yearCreated: 2023,
    artistBio: "Sarah Chen is a contemporary artist known for her abstract seascapes and innovative use of color."
  },
  {
    id: 2,
    title: "Urban Solitude",
    artist: "Marcus Rodriguez",
    price: 450,
    category: "digital",
    likes: 67,
    imageGradient: "from-gray-600 to-gray-400",
    description: "A digital masterpiece exploring the theme of solitude in modern urban landscapes. Each element tells a story of city life.",
    dimensions: "Digital Print - Various Sizes Available",
    medium: "Digital Art",
    yearCreated: 2023,
    artistBio: "Marcus Rodriguez is a digital artist who transforms urban scenes into emotional narratives."
  }
  // ... other artworks
];

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isProfileComplete, setReturnPath } = useAuth();
  const { toast } = useToast();
  const artwork = allArtworks.find(art => art.id === Number(id));

  const handleAddToCart = () => {
    if (!user) {
      setReturnPath(location.pathname);
      navigate("/signin");
      return;
    }

    // Add to cart logic here
    console.log("Adding to cart:", artwork?.title);
    toast({
      title: "Added to Cart",
      description: "Item has been added to your cart.",
      duration: 3000,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      setReturnPath(location.pathname);
      navigate("/signin");
      return;
    }

    if (!isProfileComplete) {
      navigate("/complete-profile", { state: { from: location.pathname } });
      return;
    }

    // Proceed with purchase logic
    console.log("Proceeding to checkout:", artwork?.title);
  };

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Artwork not found</h1>
          <Link to="/browse" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
            Return to Browse
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Artwork Image */}
          <div className="relative">
            <div className={`aspect-square w-full bg-gradient-to-br ${artwork.imageGradient} rounded-lg shadow-xl`}>
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>

          {/* Artwork Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
              <Link 
                to={`/artist/${artwork.artist.replace(' ', '-').toLowerCase()}`}
                className="text-xl text-purple-600 hover:text-purple-700 transition-colors"
              >
                by {artwork.artist}
              </Link>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-lg leading-relaxed">
                {artwork.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p className="font-medium">{artwork.dimensions}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Medium</p>
                  <p className="font-medium">{artwork.medium}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{artwork.yearCreated}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium capitalize">{artwork.category.replace('-', ' ')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-purple-600">
                  ${artwork.price}
                </span>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Buy Now
                </Button>
              </div>

              {user && !isProfileComplete && (
                <p className="text-sm text-gray-500 text-center">
                  Please complete your profile to proceed with purchase.
                  <Link 
                    to="/complete-profile" 
                    state={{ from: location.pathname }}
                    className="text-purple-600 hover:text-purple-700 ml-1"
                  >
                    Complete Profile
                  </Link>
                </p>
              )}
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">About the Artist</h2>
              <p className="text-gray-600">
                {artwork.artistBio}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail; 