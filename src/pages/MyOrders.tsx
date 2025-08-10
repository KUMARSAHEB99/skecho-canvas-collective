import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Navigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile, fetchCustomOrdersForUser, fetchProductOrdersForUser } from "@/lib/api";
import { User } from "@/lib/types";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const OrderStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'requested':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'accepted':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'paid':
      return <CheckCircle className="h-4 w-4 text-blue-600" />;
    case 'shipping':
      return <Truck className="h-4 w-4 text-orange-600" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'paid':
        return 'bg-blue-100 text-blue-700';
      case 'shipping':
        return 'bg-orange-100 text-orange-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const MyOrders = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [customOrders, setCustomOrders] = useState<any[]>([]);
  const [productOrders, setProductOrders] = useState<any[]>([]);
  const [customOrderLoading, setCustomOrderLoading] = useState(false);
  const [productOrderLoading, setProductOrderLoading] = useState(false);

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

  // Fetch custom orders for this user
  useEffect(() => {
    const fetchCustomOrders = async () => {
      if (!user || !userProfile) return;
      setCustomOrderLoading(true);
      try {
        const idToken = await user.getIdToken();
        const orders = await fetchCustomOrdersForUser(idToken, userProfile.id);
        setCustomOrders(orders);
      } catch (err) {
        toast({ title: "Failed to fetch custom orders", variant: "destructive" });
      } finally {
        setCustomOrderLoading(false);
      }
    };
    if (user && userProfile) fetchCustomOrders();
  }, [user, userProfile]);

  // Fetch product orders for this user
  useEffect(() => {
    const fetchProductOrders = async () => {
      if (!user || !userProfile) return;
      setProductOrderLoading(true);
      try {
        const idToken = await user.getIdToken();
        const orders = await fetchProductOrdersForUser(idToken, userProfile.id);
        setProductOrders(orders);
      } catch (err) {
        toast({ title: "Failed to fetch product orders", variant: "destructive" });
      } finally {
        setProductOrderLoading(false);
      }
    };
    if (user && userProfile) fetchProductOrders();
  }, [user, userProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Combine all orders and sort by latest to oldest
  const allOrders = [...customOrders, ...productOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const customOrdersCount = customOrders.length;
  const productOrdersCount = productOrders.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track the status of your custom art requests and product orders</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="flex overflow-x-auto whitespace-nowrap gap-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-1">
            <TabsTrigger value="all">
              All Orders
              <Badge className="ml-2" variant="secondary">{allOrders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="custom">
              Custom Art
              <Badge className="ml-2" variant="secondary">{customOrdersCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="products">
              Ready Made
              <Badge className="ml-2" variant="secondary">{productOrdersCount}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-6">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <h2 className="text-xl font-bold mb-4">All Orders</h2>
                  {customOrderLoading || productOrderLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading orders...</div>
                  ) : allOrders.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No orders found.</div>
                  ) : (
                    <Table className="min-w-[900px] text-xs sm:text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Artist</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id.slice(0, 8)}...</TableCell>
                            <TableCell>
                              <Badge variant={order.type === 'custom' ? 'default' : 'secondary'}>
                                {order.type === 'custom' ? 'Custom Art' : 'Ready Made'}
                              </Badge>
                            </TableCell>
                            <TableCell>{order.artist?.name || 'Unknown'}</TableCell>
                            <TableCell>
                              {order.type === 'custom' ? (
                                <div className="max-w-xs">
                                  <p className="font-medium">{order.description}</p>
                                  {order.paperSize && <p className="text-xs text-gray-500">Size: {order.paperSize}</p>}
                                  {order.paperType && <p className="text-xs text-gray-500">Material: {order.paperType}</p>}
                                </div>
                              ) : (
                                <div className="max-w-xs">
                                  <p className="font-medium">{order.product?.name || 'Product'}</p>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {order.basePrice ? `₹${order.basePrice}` : order.product?.price ? `₹${order.product.price}` : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <OrderStatusIcon status={order.status} />
                                <OrderStatusBadge status={order.status} />
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString()}
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

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-6">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <h2 className="text-xl font-bold mb-4">Custom Art Orders</h2>
                  {customOrderLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading custom orders...</div>
                  ) : customOrders.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No custom art orders found.</div>
                  ) : (
                    <Table className="min-w-[900px] text-xs sm:text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Artist</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Size & Material</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Reference Image</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id.slice(0, 8)}...</TableCell>
                            <TableCell>{order.artist?.name || 'Unknown'}</TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="font-medium">{order.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                {order.paperSize && <p>Size: {order.paperSize}</p>}
                                {order.paperType && <p>Material: {order.paperType}</p>}
                              </div>
                            </TableCell>
                            <TableCell>{order.basePrice ? `₹${order.basePrice}` : '-'}</TableCell>
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
                              <div className="flex items-center gap-2">
                                <OrderStatusIcon status={order.status} />
                                <OrderStatusBadge status={order.status} />
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString()}
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

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-6">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <h2 className="text-xl font-bold mb-4">Ready Made Product Orders</h2>
                  {productOrderLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading product orders...</div>
                  ) : productOrders.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No product orders found.</div>
                  ) : (
                    <Table className="min-w-[800px] text-xs sm:text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Artist</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Product Image</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id.slice(0, 8)}...</TableCell>
                            <TableCell>{order.artist?.name || 'Unknown'}</TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="font-medium">{order.product?.name || 'Product'}</p>
                                <p className="text-xs text-gray-500">{order.product?.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {order.product?.images?.[0] ? (
                                <img src={order.product.images[0]} alt="Product" className="w-16 h-16 object-cover rounded" />
                              ) : (
                                '—'
                              )}
                            </TableCell>
                            <TableCell>{order.product?.price ? `₹${order.product.price}` : '-'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <OrderStatusIcon status={order.status} />
                                <OrderStatusBadge status={order.status} />
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString()}
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
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders; 