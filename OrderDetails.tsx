import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetails } from "../services/api";
import { Order } from "../types";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchOrderDetails(parseInt(id));
    }
  }, [id]);

  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoading(true);
      const response = await getOrderDetails(orderId);
      setOrder(response.data);
    } catch (error: any) {
      console.error("Failed to fetch order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "confirmed":
      case "preparing":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "delivered":
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-orange-600 hover:text-orange-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
              <p className="text-gray-700">{order.deliveryAddress}</p>
            </div>
          )}

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium text-gray-900">
                      {item.menuItem?.name || `Item #${item.menuItemId}`}
                    </span>
                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-orange-600">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
