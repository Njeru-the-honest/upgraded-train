import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetails, processPayment } from "../services/api";
import { CreditCard, Smartphone, Banknote, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const Payment = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  useEffect(() => {
    if (orderId) {
      fetchOrder(parseInt(orderId));
    }
  }, [orderId]);

  const fetchOrder = async (id: number) => {
    try {
      const response = await getOrderDetails(id);
      setOrder(response.data);
    } catch (error) {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      setProcessing(true);
      const response = await processPayment(parseInt(orderId!), {
        paymentMethod: selectedMethod
      });

      if (response.data.paymentStatus === "SUCCESS") {
        toast.success("Payment successful!");
        navigate(`/orders/${orderId}`);
      } else if (response.data.paymentStatus === "PENDING") {
        toast.success("Order placed! Payment pending.");
        navigate(`/orders/${orderId}`);
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: "MPESA",
      name: "M-Pesa",
      icon: Smartphone,
      description: "Pay with M-Pesa mobile money"
    },
    {
      id: "CARD",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay with your card"
    },
    {
      id: "COD",
      name: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when you receive your order"
    }
  ];

  const calculateTotal = () => {
    if (!order) return 0;
    const items = order.orderItems || [];
    return items.reduce((total: number, item: any) => {
      const price = item.unitPrice || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-orange-600 hover:text-orange-700"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Order</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment</h1>
          <div className="flex justify-between items-center border-t border-b py-4">
            <span className="text-lg text-gray-700">Total Amount:</span>
            <span className="text-2xl font-bold text-orange-600">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
          
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 border-2 rounded-lg transition-all ${
                  selectedMethod === method.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    selectedMethod === method.id ? "bg-orange-500" : "bg-gray-100"
                  }`}>
                    <method.icon className={`h-6 w-6 ${
                      selectedMethod === method.id ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedMethod === method.id
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handlePayment}
            disabled={!selectedMethod || processing}
            className="w-full mt-6 bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? "Processing..." : "Complete Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;