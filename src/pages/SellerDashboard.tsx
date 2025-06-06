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
import { Navigate, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - would come from API in production
const mockProducts = [
  {
    id: 1,
    title: "Ocean Dreams",
    price: 285,
    status: "available",
    likes: 42,
    views: 156
  },
  {
    id: 2,
    title: "Urban Solitude",
    price: 450,
    status: "sold",
    likes: 67,
    views: 234
  },
  {
    id: 3,
    title: "Mystic Forest",
    price: 375,
    status: "available",
    likes: 28,
    views: 112
  }
];

const mockOrders = [
  {
    id: "ORD-001",
    product: "Ocean Dreams",
    customer: "John Doe",
    date: "2024-03-15",
    status: "Delivered",
    amount: 285
  },
  {
    id: "ORD-002",
    product: "Urban Solitude",
    customer: "Jane Smith",
    date: "2024-03-14",
    status: "Processing",
    amount: 450
  }
];

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
  const { user, isProfileComplete } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Redirect if profile not complete
  // if (!isProfileComplete) {
  //   return <Navigate to="/complete-profile" state={{ from: "/dashboard" }} replace />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your artworks and track your sales</p>
          </div>
          <Button className="bg-skecho-coral hover:bg-skecho-coral-dark">
            <Plus className="w-4 h-4 mr-2" />
            Add New Artwork
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Sales"
            value="$2,850"
            icon={DollarSign}
            trend="+12.5%"
          />
          <StatCard
            title="Active Listings"
            value="8"
            icon={Package}
            trend="+2"
          />
          <StatCard
            title="Total Orders"
            value="24"
            icon={ShoppingBag}
            trend="+8.1%"
          />
          <StatCard
            title="Profile Views"
            value="1.2k"
            icon={Users}
            trend="+28.4%"
          />
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
                      <TableHead>Likes</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.status === 'available' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {product.status}
                          </span>
                        </TableCell>
                        <TableCell>{product.likes}</TableCell>
                        <TableCell>{product.views}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>${order.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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