import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Share2, Trash2, Minus, Plus } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/CartContext";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  isAvailable: boolean;
  quantity: number;
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, isInCart, cart, isLoading: isCartLoading, updateQuantity } = useCart();
  const { user, isProfileComplete, setReturnPath } = useAuth();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axios.get(`http://40.81.226.49/api/products/${id}`);
      return response.data;
    },
    enabled: !!id
  });

  const cartItem = cart?.items.find(item => item.product.id === id);

  const handleCartAction = async () => {
    if (!user) {
      setReturnPath(location.pathname);
      navigate("/signin");
      return;
    }

    if (cartItem) {
      await removeFromCart(cartItem.id);
    } else {
      await addToCart(id!);
    }
  };

  const handleQuantityChange = async (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 0)) {
      try {
        await updateQuantity(itemId, newQuantity);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to update quantity",
          variant: "destructive",
        });
      }
    }
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
    console.log("Proceeding to checkout:", product?.name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-8">
              <div>
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Artwork not found</h1>
          <Link to="/browse" className="text-skecho-coral hover:text-skecho-coral-dark mt-4 inline-block">
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
            {product.images && product.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <img
                        src={img}
                        alt={product.name + ' image ' + (idx + 1)}
                        className="w-full aspect-square object-cover rounded-lg shadow-xl"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="aspect-square w-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-xl flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          {/* Artwork Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <Link 
                to={`/artist/${product.seller.id}`}
                className="text-xl text-skecho-coral hover:text-skecho-coral-dark transition-colors"
              >
                by {product.seller.user.name}
              </Link>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map(category => (
                    <span key={category.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Listed On</p>
                <p className="font-medium">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-skecho-coral">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {product.isAvailable  ? (
                    <span>{product.quantity} available</span>
                  ) : (
                    <span className="text-red-500">Out of stock</span>
                  )}
                </div>
                {/* <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div> */}
              </div>
            </div>
            
            {product.isAvailable && product.quantity > 0 ? (
              <div className="mt-8 space-y-4">
                {cartItem ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon" 
                        variant="outline"
                        onClick={() => handleCartAction()}
                        className="bg-red-50 hover:bg-red-100 border-red-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity, -1)}
                          disabled={cartItem.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{cartItem.quantity}</span>
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity, 1)}
                          disabled={cartItem.quantity >= product.quantity}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleBuyNow}
                      className="flex-1 bg-skecho-coral hover:bg-skecho-coral-dark text-white"
                    >
                      Buy Now
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleCartAction} 
                    className="w-full bg-skecho-coral hover:bg-skecho-coral-dark text-white"
                    disabled={!product.isAvailable || product.quantity === 0}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            ) : (
              <div className="mt-8">
                <Button 
                  disabled
                  className="w-full"
                >
                  {product.quantity === 0 ? 'Out of Stock' : 'Not Available'}
                </Button>
              </div>
            )}

            {user && !isProfileComplete && (
              <p className="text-sm text-gray-500 text-center">
                Please complete your profile to proceed with purchase.
                <Link 
                  to="/complete-profile" 
                  state={{ from: location.pathname }}
                  className="text-skecho-coral hover:text-skecho-coral-dark ml-1"
                >
                  Complete Profile
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail; 