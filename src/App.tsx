import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Signin from "./pages/Signin";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import ArtistProfile from "./pages/ArtistProfile";
import CompleteProfile from "./pages/CompleteProfile";
import SellerDashboard from "./pages/SellerDashboard";
import { AuthProvider } from "./lib/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/artwork/:id" element={<ProductDetail />} />
            <Route path="/artist/:slug" element={<ArtistProfile />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/dashboard" element={<SellerDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
