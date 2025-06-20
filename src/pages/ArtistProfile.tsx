import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

interface Seller {
  id: string;
  profileImage: string | null;
  user: {
    name: string;
    email: string;
    createdAt: string;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    images: string[];
    isAvailable: boolean;
    categories: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

const CustomArtRequestForm = ({ artistName, artistEmail }: { artistName: string; artistEmail: string }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    budget: "",
    timeline: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - would typically send to an API
    console.log("Form submitted:", {
      ...formData,
      artistName,
      artistEmail
    });
    // Add success message or redirect
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Project Description</label>
        <Textarea
          id="description"
          placeholder="Please describe your vision for the custom artwork..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="h-32"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="budget" className="text-sm font-medium">Budget Range</label>
        <Input
          id="budget"
          placeholder="e.g., $500-1000"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="timeline" className="text-sm font-medium">Desired Timeline</label>
        <Input
          id="timeline"
          placeholder="e.g., 2-3 weeks"
          value={formData.timeline}
          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full bg-skecho-coral hover:bg-skecho-coral-dark text-white">
        Submit Request
      </Button>
    </form>
  );
};

const ArtistProfile = () => {
  const { id } = useParams();
  const { data: seller, isLoading, error } = useQuery<Seller>({
    queryKey: ['seller', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/seller/${id}`);
      return response.data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="md:col-span-2 space-y-6">
              <div>
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div>
                <Skeleton className="h-24 w-full" />
              </div>
              <div>
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Artist not found</h1>
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
        {/* Artist Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Artist Photo/Avatar */}
          <div className="relative">
            <div className="aspect-square w-full bg-gradient-to-br from-skecho-coral to-skecho-coral-dark rounded-lg shadow-xl flex items-center justify-center overflow-hidden">
              {seller.profileImage ? (
                <img 
                  src={seller.profileImage} 
                  alt={`${seller.user.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-32 h-32 text-white" />
              )}
            </div>
          </div>

          {/* Artist Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{seller.user.name}</h1>
              <p className="text-gray-600">Member since {new Date(seller.user.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(seller.products.flatMap(p => p.categories.map(c => c.name)))).map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-skecho-coral/10 text-skecho-coral-dark rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-skecho-coral hover:bg-skecho-coral-dark text-white">
                  Request Custom Artwork
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Request Custom Artwork</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to request a custom piece from {seller.user.name}.
                  </DialogDescription>
                </DialogHeader>
                <CustomArtRequestForm artistName={seller.user.name} artistEmail={seller.user.email} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Artist Portfolio */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seller.products.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
                <Link to={`/artwork/${product.id}`}>
                  <div className="relative">
                    <div className="h-64 relative overflow-hidden">
                      {product.images[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                        product.isAvailable 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.isAvailable ? 'Available' : 'Sold'}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-skecho-coral transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-skecho-coral mt-2">
                      ${product.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArtistProfile; 