import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Search, LogOut, Palette } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/lib/CartContext";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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

          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-skecho-coral text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-skecho-coral-light/50">
                      <span className="text-gray-700 mr-2">
                        {user.displayName || user.email}
                      </span>
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {location.pathname != "/dashboard" && <DropdownMenuItem>
                      <Link to="/dashboard" className="flex items-center w-full">
                        <Palette className="w-4 h-4 mr-2" />
                        Switch to Seller
                      </Link>
                    </DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/edit-profile" className="flex items-center w-full">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/signin">
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
