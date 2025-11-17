import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetails } from "../services/api";
import { Order } from "../types";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import FeedbackModal from "../components/FeedbackModal";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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
      console.log("Order details response:", response.data);
      setOrder(response.data);
    } catch (error: any) {
      console.error("Failed to fetch order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "PREPARING":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "EN_ROUTE":
        return <Package className="h-6 w-6 text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
        return "bg-yellow-100 text-yellow-800";
      case "PREPARING":
        return "bg-blue-100 text-blue-800";
      case "EN_ROUTE":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateTotal = () => {
    if (!order) return 0;
    const items = order.orderItems || order.items || [];
    return items.reduce((total, item) => {
      const price = item.unitPrice || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
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

  const orderItems = order.orderItems || order.items || [];

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
                Placed on {new Date(order.orderDate || order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.orderDate || order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {order.restaurant && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Restaurant</h3>
              <p className="text-gray-700 font-medium">{order.restaurant.name}</p>
              {order.restaurant.location && (
                <p className="text-gray-600 text-sm">{order.restaurant.location}</p>
              )}
            </div>
          )}

          {order.customer && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
              <p className="text-gray-700">{order.customer.name}</p>
              <p className="text-gray-600 text-sm">{order.customer.email}</p>
            </div>
          )}

          {order.deliveryAddress && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
              <p className="text-gray-700">{order.deliveryAddress}</p>
            </div>
          )}

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            
            {orderItems.length > 0 ? (
              <div className="space-y-3">
                {orderItems.map((item, index) => {
                  const itemPrice = item.unitPrice || item.price || 0;
                  return (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 block">
                          {item.menuItem?.name || `Item #${item.menuItemId}`}
                        </span>
                        {item.menuItem?.description && (
                          <span className="text-sm text-gray-600 block">
                            {item.menuItem.description}
                          </span>
                        )}
                        <span className="text-gray-600 text-sm">Quantity: {item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900 block">
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-600">
                          ${itemPrice.toFixed(2)} each
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No items in this order</p>
            )}

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-orange-600">
                  ${(order.totalAmount || calculateTotal()).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {order.payment && (
            <div className="border-t mt-6 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900">{order.payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.payment.paymentStatus === "SUCCESS" 
                      ? "bg-green-100 text-green-800" 
                      : order.payment.paymentStatus === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {order.payment.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium text-gray-900">
                    ${order.payment.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Pay Now Button - Show if order is placed but not paid */}
          {order.status === "PLACED" && !order.payment && (
            <button
              onClick={() => navigate(`/payment/${order.id}`)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              💳 Pay Now
            </button>
          )}

          {/* Leave Review Button - Show if order is delivered and paid */}
          {order.status === "DELIVERED" && order.payment?.paymentStatus === "SUCCESS" && order.restaurant && (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              ⭐ Leave a Review
            </button>
          )}

          {/* Continue Shopping Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors" > Continue Shopping </button> 
            </div> 
            
            </div>
              {/* Feedback Modal */}
  {showFeedbackModal && order.restaurant && (
    <FeedbackModal
      restaurantId={order.restaurant.id}
      restaurantName={order.restaurant.name}
      onClose={() => setShowFeedbackModal(false)}
      onSuccess={() => {
        fetchOrderDetails(parseInt(id!));
      }}
    />
  )}
</div>
  );
};

export default OrderDetails;