
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const spotlightArtists = [
  {
    id: 1,
    name: "Sarah Chen",
    bio: "Abstract expressionist with a passion for ocean-inspired themes",
    categories: ["Abstract", "Acrylic", "Large Format"],
    artworksCount: 24,
    followers: 1250,
    avatarGradient: "from-blue-400 to-purple-400"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    bio: "Digital artist creating surreal urban landscapes",
    categories: ["Digital", "Illustration", "Concept Art"],
    artworksCount: 18,
    followers: 890,
    avatarGradient: "from-orange-400 to-red-400"
  },
  {
    id: 3,
    name: "Emma Thompson",
    bio: "Traditional oil painter specializing in botanical subjects",
    categories: ["Oil Painting", "Botanical", "Realism"],
    artworksCount: 31,
    followers: 2100,
    avatarGradient: "from-green-400 to-teal-400"
  }
];

export const ArtistSpotlight = () => {
  return (
    <section className="py-20 px-4 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Artist Spotlight</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the talented artists making waves in our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {spotlightArtists.map((artist) => (
            <Card key={artist.id} className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="relative mx-auto w-24 h-24">
                    <div className={`w-full h-full bg-gradient-to-br ${artist.avatarGradient} rounded-full flex items-center justify-center`}>
                      <User className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <Link to={`/artist/${artist.name.replace(' ', '-').toLowerCase()}`}>
                      <h3 className="text-xl font-semibold hover:text-purple-600 transition-colors cursor-pointer">
                        {artist.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                      {artist.bio}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {artist.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{artist.artworksCount}</div>
                      <div className="text-sm text-gray-600">Artworks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{artist.followers.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                  </div>

                  <Link to={`/artist/${artist.name.replace(' ', '-').toLowerCase()}`}>
                    <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/artists">
            <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-50">
              Discover More Artists
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
