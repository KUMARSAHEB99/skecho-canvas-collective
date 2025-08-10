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
import { fetchSeller, fetchUserProfile, deleteProduct, updateCustomOrderStatus, fetchCustomOrdersForArtist, fetchSellers } from "@/lib/api";
import { Seller, User } from "@/lib/types";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
  const [customOrders, setCustomOrders] = useState<any[]>([]);
  const [customOrderMessages, setCustomOrderMessages] = useState<{ [orderId: string]: string }>({});
  const [customOrderLoading, setCustomOrderLoading] = useState(false);
  const [markingCompleteId, setMarkingCompleteId] = useState<string | null>(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  
  // Fetch seller profile and products
  const { data: sellerProfiles, isLoading, error } = useQuery({
    queryKey: ["sellerProfile"],
    queryFn: async()=>{
      const idToken = await user?.getIdToken();
      console.log("idToken", idToken);
      console.log("user", user?.uid);
      return fetchSellers();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!user,
  });

  // Fetch current user's DB id
  const { data: userProfile } = useQuery<User>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const idToken = await user?.getIdToken();
      return fetchUserProfile(idToken);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
  });

  // Fetch custom orders for this seller (artist)
  useEffect(() => {
    const fetchCustomOrders = async () => {
      if (!user || !userProfile) return;
      setCustomOrderLoading(true);
      try {
        const idToken = await user.getIdToken();
        const orders = await fetchCustomOrdersForArtist(idToken, userProfile.id);
        setCustomOrders(orders);
      } catch (err) {
        toast({ title: "Failed to fetch custom orders", variant: "destructive" });
      } finally {
        setCustomOrderLoading(false);
      }
    };
    if (user && userProfile) fetchCustomOrders();
  }, [user, userProfile]);

  // Approve or reject order
  const handleOrderAction = async (orderId: string, action: 'accepted' | 'rejected') => {
    try {
      const idToken = await user.getIdToken();
      await updateCustomOrderStatus(idToken, orderId, action, customOrderMessages[orderId]);
      setCustomOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: action, rejectionReason: action === 'rejected' ? customOrderMessages[orderId] : null } : order
        )
      );
      setCustomOrderMessages((prev) => ({ ...prev, [orderId]: '' }));
      toast({ title: `Order ${action === 'accepted' ? 'approved' : 'rejected'}` });
    } catch (err) {
      toast({ title: `Failed to update order`, variant: 'destructive' });
    }
  };

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

  // Split custom orders by status
  const requestedOrders = customOrders.filter(order => order.status === 'requested');
  const acceptedOrders = customOrders.filter(order => order.status === 'accepted');
  // Placeholder for normal orders count (if you implement it)
  const ordersCount = 0; // Replace with actual count if you have normal orders

  return (
    <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your artworks and track your sales</p>
          </div>
          <Link to="/add-product" className="w-full md:w-auto">
            <Button className="bg-skecho-coral hover:bg-skecho-coral-dark w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Artwork
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-4 mb-8">
          <StatCard
            title="Total Artworks"
            value={products.length}
            icon={Package}
            trend={undefined}
          />
          {/* You can add more stats here if you have them */}
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="flex overflow-x-auto whitespace-nowrap gap-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-1">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">
              Orders
              {ordersCount > 0 && <Badge className="ml-2" variant="secondary">{ordersCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="requested">
              Requested Orders
              {requestedOrders.length > 0 && <Badge className="ml-2" variant="secondary">{requestedOrders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted Orders
              {acceptedOrders.length > 0 && <Badge className="ml-2" variant="secondary">{acceptedOrders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardContent className="p-1 sm:p-6">
                <div className="overflow-x-auto -mx-1 sm:mx-0">
                  <Table className="w-full text-xs sm:text-sm">
                  <TableHeader>
                    <TableRow>
                        <TableHead className="px-1 py-2 w-1/3">Title</TableHead>
                        <TableHead className="px-1 py-2 w-1/4">Price</TableHead>
                        <TableHead className="px-1 py-2 w-1/4">Status</TableHead>
                        <TableHead className="px-1 py-2 w-1/4 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-500 px-1 py-2">
                            No products found.
                          </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product: any) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium px-1 py-2 truncate max-w-[100px]">{product.name}</TableCell>
                            <TableCell className="px-1 py-2">${product.price}</TableCell>
                            <TableCell className="px-1 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.isAvailable
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {product.isAvailable ? 'available' : 'sold'}
                              </span>
                            </TableCell>
                            <TableCell className="px-1 py-2 text-center">
                              <div className="flex flex-row items-center gap-1 justify-center">
                                {/* Edit Button */}
                                <Button size="sm" variant="ghost" className="p-1" onClick={() => navigate(`/edit-product/${product.id}`)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {/* Delete Button */}
                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 p-1" onClick={() => setDeletingProductId(product.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
            {/* Delete Confirmation Dialog */}
            <ConfirmDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
              <ConfirmDialogContent>
                <ConfirmDialogHeader>
                  <ConfirmDialogTitle>Delete Product</ConfirmDialogTitle>
                </ConfirmDialogHeader>
                <div>Are you sure you want to delete this product?</div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" onClick={() => setDeletingProductId(null)} disabled={isDeleting}>Cancel</Button>
                  <Button variant="destructive" onClick={async () => {
                    if (!deletingProductId) return;
                    setIsDeleting(true);
                    try {
                      const idToken = await user?.getIdToken();
                      await deleteProduct(idToken, deletingProductId);
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
              </ConfirmDialogContent>
            </ConfirmDialog>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-6">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <h2 className="text-xl font-bold mb-4">Custom Art Orders</h2>
                  {customOrderLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading custom orders...</div>
                  ) : customOrders.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No custom orders found.</div>
                  ) : (
                    <Table className="min-w-[800px] text-xs sm:text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Reference Image</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id.slice(0, 8)}...</TableCell>
                            <TableCell>{order.user?.name || order.userId}</TableCell>
                            <TableCell>{order.description}</TableCell>
                            <TableCell>
                              {order.referenceImage ? (
                                <a href={order.referenceImage} target="_blank" rel="noopener noreferrer">
                                  <img src={order.referenceImage} alt="Reference" className="w-16 h-16 object-cover rounded" />
                                </a>
                              ) : (
                                '—'
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'requested'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : order.status === 'accepted'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                className="border rounded px-2 py-1 text-sm w-32"
                                placeholder="Message (optional)"
                                value={customOrderMessages[order.id] || ''}
                                onChange={e => setCustomOrderMessages(prev => ({ ...prev, [order.id]: e.target.value }))}
                                disabled={order.status !== 'requested'}
                              />
                            </TableCell>
                            <TableCell>
                              {order.status === 'requested' ? (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => handleOrderAction(order.id, 'accepted')}>Approve</Button>
                                  <Button size="sm" variant="destructive" className="w-full sm:w-auto" onClick={() => handleOrderAction(order.id, 'rejected')}>Reject</Button>
                                </div>
                              ) : order.status === 'rejected' ? (
                                <span className="text-xs text-red-600">{order.rejectionReason}</span>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requested" className="space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-6">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <h2 className="text-xl font-bold mb-4">Requested Custom Orders</h2>
                  {customOrderLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading custom orders...</div>
                  ) : requestedOrders.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No requested orders found.</div>
                  ) : (
                    <Table className="min-w-[900px] text-xs sm:text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Material</TableHead>
                          <TableHead>Total Price</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Reference Image</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requestedOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id.slice(0, 8)}...</TableCell>
                            <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                            <TableCell>{order.paperSize || '-'}</TableCell>
                            <TableCell>{order.paperType || '-'}</TableCell>
                            <TableCell>{order.basePrice ? `₹${order.basePrice}` : '-'}</TableCell>
                            <TableCell>{order.description}</TableCell>
                            <TableCell>
                              {order.referenceImage ? (
                                <a href={order.referenceImage} target="_blank" rel="noopener noreferrer">
                                  <img src={order.referenceImage} alt="Reference" className="w-16 h-16 object-cover rounded" />
                                </a>
                              ) : (
                                '—'
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                className="border rounded px-2 py-1 text-sm w-32"
                                placeholder="Message (optional)"
                                value={customOrderMessages[order.id] || ''}
                                onChange={e => setCustomOrderMessages(prev => ({ ...prev, [order.id]: e.target.value }))}
                                disabled={order.status !== 'requested'}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => handleOrderAction(order.id, 'accepted')}>Approve</Button>
                                <Button size="sm" variant="destructive" className="w-full sm:w-auto" onClick={() => handleOrderAction(order.id, 'rejected')}>Reject</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-6">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <h2 className="text-xl font-bold mb-4">Accepted Custom Orders</h2>
                  {customOrderLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading custom orders...</div>
                  ) : acceptedOrders.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No accepted orders found.</div>
                  ) : (
                    <Table className="min-w-[900px] text-xs sm:text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Material</TableHead>
                          <TableHead>Total Price</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Reference Image</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {acceptedOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id.slice(0, 8)}...</TableCell>
                            <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                            <TableCell>{order.paperSize || '-'}</TableCell>
                            <TableCell>{order.paperType || '-'}</TableCell>
                            <TableCell>{order.basePrice ? `₹${order.basePrice}` : '-'}</TableCell>
                            <TableCell>{order.description}</TableCell>
                            <TableCell>
                              {order.referenceImage ? (
                                <a href={order.referenceImage} target="_blank" rel="noopener noreferrer">
                                  <img src={order.referenceImage} alt="Reference" className="w-16 h-16 object-cover rounded" />
                                </a>
                              ) : (
                                '—'
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setMarkingCompleteId(order.id)}>
                                Mark as Completed
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Confirmation Dialog for Mark as Completed */}
            <ConfirmDialog open={!!markingCompleteId} onOpenChange={() => setMarkingCompleteId(null)}>
              <ConfirmDialogContent>
                <ConfirmDialogHeader>
                  <ConfirmDialogTitle>Mark Order as Completed</ConfirmDialogTitle>
                </ConfirmDialogHeader>
                <div>Are you sure you want to mark this order as completed?</div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" onClick={() => setMarkingCompleteId(null)} disabled={isMarkingComplete}>Cancel</Button>
                  <Button variant="default" onClick={async () => {
                    if (!markingCompleteId) return;
                    setIsMarkingComplete(true);
                    try {
                      const idToken = await user.getIdToken();
                      await updateCustomOrderStatus(idToken, markingCompleteId, 'delivered');
                      setCustomOrders((prev) =>
                        prev.map((order) =>
                          order.id === markingCompleteId ? { ...order, status: 'delivered' } : order
                        )
                      );
                      setMarkingCompleteId(null);
                      toast({ title: 'Order marked as completed' });
                    } catch (err) {
                      toast({ title: 'Failed to mark as completed', variant: 'destructive' });
                    } finally {
                      setIsMarkingComplete(false);
                    }
                  }} disabled={isMarkingComplete}>
                    {isMarkingComplete ? 'Marking...' : 'Mark as Completed'}
                  </Button>
                </div>
              </ConfirmDialogContent>
            </ConfirmDialog>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-6">
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