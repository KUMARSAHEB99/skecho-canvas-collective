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

// This would typically come from an API
const artists = [
  {
    id: 1,
    name: "Sarah Chen",
    slug: "sarah-chen",
    photo: "from-blue-400 to-cyan-300", // This would be a real image URL in production
    bio: "Sarah Chen is a contemporary artist known for her abstract seascapes and innovative use of color. With over a decade of experience, she has developed a unique style that combines traditional techniques with modern perspectives. Her work has been featured in numerous galleries across the country.",
    location: "San Francisco, CA",
    specialties: ["Abstract", "Seascapes", "Mixed Media"],
    artworks: [
      {
        id: 1,
        title: "Ocean Dreams",
        price: 285,
        imageGradient: "from-blue-400 to-cyan-300",
        status: "available"
      },
      {
        id: 3,
        title: "Coastal Meditation",
        price: 350,
        imageGradient: "from-teal-400 to-blue-300",
        status: "sold"
      }
    ]
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    slug: "marcus-rodriguez",
    photo: "from-purple-400 to-pink-300",
    bio: "Marcus Rodriguez is a digital artist who transforms urban scenes into emotional narratives. His work explores the intersection of technology and human experience in modern cities.",
    location: "New York, NY",
    specialties: ["Digital Art", "Urban Landscapes", "Photography"],
    artworks: [
      {
        id: 2,
        title: "Urban Solitude",
        price: 450,
        imageGradient: "from-gray-600 to-gray-400",
        status: "available"
      }
    ]
  }
];

const CustomArtRequestForm = () => {
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
    console.log("Form submitted:", formData);
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

      <div className="grid grid-cols-2 gap-4">
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
            placeholder="e.g., 2-3 months"
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
        Submit Request
      </Button>
    </form>
  );
};

const ArtistProfile = () => {
  const { slug } = useParams();
  const artist = artists.find(a => a.slug === slug);

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Artist not found</h1>
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
        {/* Artist Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Artist Photo */}
          <div className="relative">
            <div className={`aspect-square w-full bg-gradient-to-br ${artist.photo} rounded-lg shadow-xl`}>
              <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
            </div>
          </div>

          {/* Artist Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{artist.name}</h1>
              <p className="text-gray-600">{artist.location}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-600 leading-relaxed">{artist.bio}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {artist.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  Request Custom Artwork
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Request Custom Artwork</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to request a custom piece from {artist.name}.
                  </DialogDescription>
                </DialogHeader>
                <CustomArtRequestForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Artist Portfolio */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artist.artworks.map((artwork) => (
              <Card key={artwork.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
                <Link to={`/artwork/${artwork.id}`}>
                  <div className="relative">
                    <div className={`h-64 bg-gradient-to-br ${artwork.imageGradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                        artwork.status === 'available' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {artwork.status === 'available' ? 'Available' : 'Sold'}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {artwork.title}
                    </h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">
                      ${artwork.price}
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