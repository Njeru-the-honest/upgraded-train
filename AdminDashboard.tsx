import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { getAdminDashboard } from "../services/api";
import { 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  MapPin,
  Phone
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface DashboardStats {
  totalRestaurants: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  restaurants: any[];
  recentOrders: any[];
  customers: any[];
}

const AdminDashboard = () => {
  const { user, logout } = useContext(UserContext);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "restaurants" | "orders" | "customers">("overview");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getAdminDashboard();
      console.log("Admin dashboard data:", response.data);
      setStats(response.data);
    } catch (error: any) {
      console.error("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <button
            onClick={fetchDashboard}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

// Around line 104, update the statCards array:
const statCards = [
  {
    title: "Total Restaurants",
    value: stats.totalRestaurants,
    icon: Store,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    title: "Total Orders",
    value: stats.totalOrders,
    icon: ShoppingBag,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600"
  },
  {
    title: "Total Customers",
    value: stats.totalCustomers,
    icon: Users,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  {
    title: "Total Revenue",
    value: `$${(stats.totalRevenue || 0).toFixed(2)}`, // Add || 0 for safety
    icon: DollarSign,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600"
  }
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}! 👋</p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "restaurants", label: "🏪 Restaurants" },
            { id: "orders", label: "📦 Orders" },
            { id: "customers", label: "👥 Customers" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} p-4 rounded-xl`}>
                      <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Restaurant</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-900">#{order.id}</td>
                          <td className="py-4 px-4 text-gray-700">{order.customer?.name || "N/A"}</td>
                          <td className="py-4 px-4 text-gray-700">{order.restaurant?.name || "N/A"}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                              order.status === "PREPARING" ? "bg-yellow-100 text-yellow-800" :
                              order.status === "EN_ROUTE" ? "bg-blue-100 text-blue-800" :
                              order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Restaurants Tab */}
        {activeTab === "restaurants" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Restaurants ({stats.restaurants?.length || 0})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.restaurants && stats.restaurants.length > 0 ? (
                stats.restaurants.map((restaurant: any, index: number) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <Store className="h-20 w-20 text-white opacity-50" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{restaurant.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2 text-gray-600">
                          <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{restaurant.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm">{restaurant.contactInfo}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-orange-600 font-semibold">
                          <TrendingUp className="h-5 w-5" />
                          <span className="text-sm">
                            {restaurant.menuItems?.length || 0} menu items
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No restaurants found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                All Orders ({stats.recentOrders?.length || 0})
              </h2>
            </div>

            <div className="grid gap-4">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order: any, index: number) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                            order.status === "PREPARING" ? "bg-yellow-100 text-yellow-800" :
                            order.status === "EN_ROUTE" ? "bg-blue-100 text-blue-800" :
                            order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {order.status}
                          </span>
                        </div> 
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"> <div> <p className="text-gray-500 mb-1">Customer</p> <p className="font-semibold text-gray-900">{order.customer?.name || "N/A"}</p> </div> <div> <p className="text-gray-500 mb-1">Restaurant</p> <p className="font-semibold text-gray-900">{order.restaurant?.name || "N/A"}</p> </div> <div> <p className="text-gray-500 mb-1">Order Date</p> <p className="font-semibold text-gray-900"> {new Date(order.orderDate).toLocaleString()} </p> </div> </div> {order.orderItems && order.orderItems.length > 0 && ( <div className="mt-4"> <p className="text-gray-500 text-sm mb-2">Items ({order.orderItems.length})</p> <div className="flex flex-wrap gap-2"> {order.orderItems.map((item: any, idx: number) => ( <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"> {item.quantity}x {item.menuItem?.name || "Item"} </span> ))} </div> </div> )} </div> </div> </motion.div> )) ) : ( <div className="bg-white rounded-xl shadow-md p-12 text-center"> <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" /> <p className="text-gray-500 text-lg">No orders found</p> </div> )} </div> </motion.div> )}
                            {/* Customers Tab */}
    {activeTab === "customers" && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            All Customers ({stats.customers?.length || 0})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.customers && stats.customers.length > 0 ? (
            stats.customers.map((customer: any, index: number) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                      {customer.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 truncate">📧 {customer.email}</p>
                      {customer.address && (
                        <p className="text-gray-600 truncate">📍 {customer.address}</p>
                      )}
                      {customer.phoneNumber && (
                        <p className="text-gray-600 truncate">📞 {customer.phoneNumber}</p>
                      )}
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-orange-600 font-semibold">
                          📦 {customer.orders?.length || 0} orders
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No customers found</p>
            </div>
          )}
        </div>
      </motion.div>
    )}
  </div>
</div>
  );
};
export default AdminDashboard;