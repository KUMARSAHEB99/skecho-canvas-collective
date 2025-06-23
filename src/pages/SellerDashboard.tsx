import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { log } from "console";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog ,DialogContent,DialogHeader,DialogTitle} from "@/components/ui/dialog"

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {trend && (
        <p className="text-xs text-green-600 flex items-center mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend} from last month
        </p>
      )}
    </CardContent>
  </Card>
);

const SellerDashboard = () => {
  const { user, isSellerProfileComplete ,loading} = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch seller profile and products
  const { data: sellerProfiles, isLoading, error } = useQuery({
    queryKey: ["sellerProfile"],
    queryFn: async () => {
      const idToken = await user?.getIdToken();
      const res = await axios.get(
        "http://localhost:3000/api/seller",
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      
      console.log("Seller profile data:", res.data);
      return res.data;
    },
    enabled: !!user,
  });

  if(loading){
    console.log("loading is true");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }
  // Redirect if authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Redirect if seller profile not complete
  if (!isSellerProfileComplete && !loading) {
    console.log("seller profile not complete");
    return <Navigate to="/complete-seller-profile" state={{ from: "/dashboard" }} replace />;
    // return (
    //   <div className="min-h-screen flex items-center justify-center">
    //     <div className="text-lg text-gray-600">Seller profile not complete</div>
    //   </div>
    // );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Failed to load dashboard. Please try again later.</div>
      </div>
    );
  }
  // Extract products from seller profile
  const sellerProfile= sellerProfiles?.[0];
  const products = sellerProfile?.products || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your artworks and track your sales</p>
          </div>
          <Link to="/add-product">
            <Button className="bg-skecho-coral hover:bg-skecho-coral-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add New Artwork
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Artworks"
            value={products.length}
            icon={Package}
            trend={undefined}
          />
          {/* You can add more stats here if you have them */}
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product: any) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.isAvailable
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {product.isAvailable ? 'available' : 'sold'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {/* Edit Button */}
                              <Button size="sm" variant="ghost" onClick={() => navigate(`/edit-product/${product.id}`)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              {/* Delete Button */}
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => setDeletingProductId(product.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Product</DialogTitle>
                </DialogHeader>
                <div>Are you sure you want to delete this product?</div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" onClick={() => setDeletingProductId(null)} disabled={isDeleting}>Cancel</Button>
                  <Button variant="destructive" onClick={async () => {
                    if (!deletingProductId) return;
                    setIsDeleting(true);
                    try {
                      const idToken = await user?.getIdToken();
                      await axios.delete(`http://localhost:3000/api/products/${deletingProductId}`, {
                        headers: { Authorization: `Bearer ${idToken}` },
                      });
                      toast({ title: "Product deleted" });
                      setDeletingProductId(null);
                      // Invalidate and refetch
                      queryClient.invalidateQueries({ queryKey: ['sellerProfile'] });
                    } catch (err) {
                      toast({ title: "Failed to delete product", variant: "destructive" });
                    } finally {
                      setIsDeleting(false);
                    }
                  }} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500 py-8">
                  Orders functionality coming soon.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Detailed analytics coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard; 