
import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Search } from "lucide-react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-skecho-coral/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-skecho-coral rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-skecho-charcoal">
              Skecho
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search artworks, artists..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-skecho-coral focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-gray-700 hover:text-skecho-coral-dark transition-colors">
              Browse Art
            </Link>
            <Link to="/artists" className="text-gray-700 hover:text-skecho-coral-dark transition-colors">
              Artists
            </Link>
            <Link to="/custom" className="text-gray-700 hover:text-skecho-coral-dark transition-colors">
              Custom Art
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative hover:bg-skecho-coral-light/50">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-skecho-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hover:bg-skecho-coral-light/50">
                <User className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-skecho-coral hover:bg-skecho-coral-dark text-white">
                Join as Artist
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
