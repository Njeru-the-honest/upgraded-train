import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

/* === AUTH === */
export const registerUser = async (data: { name: string; email: string; password: string; address: string; phoneNumber: string; role: string }) => 
  api.post("/auth/register", data);

export const loginUser = async (data: { email: string; password: string }) => 
  api.post("/auth/login", data);

export const getUserProfile = async () => 
  api.get("/v1/users/me");

/* === RESTAURANTS === */
export const getRestaurants = async () => 
  api.get("/v1/restaurants");

export const getMenuByRestaurant = async (id: number) => 
  api.get(`/v1/restaurants/${id}/menu`);

export const getRestaurantFeedbacks = async (id: number) =>
  api.get(`/v1/feedback/restaurant/${id}`);

export const getRestaurantRating = async (id: number) =>
  api.get(`/v1/feedback/restaurant/${id}/rating`);

/* === ORDERS === */
export const placeOrder = async (orderData: any) => 
  api.post("/v1/orders", orderData);

export const getUserOrders = async () => 
  api.get("/v1/orders/user");

export const getOrderDetails = async (id: number) => 
  api.get(`/v1/orders/${id}`);

export const updateOrderStatus = async (id: number, status: string) =>
  api.put(`/v1/orders/${id}/status`, { status });

export const cancelOrder = async (id: number) =>
  api.put(`/v1/orders/${id}/cancel`);

/* === PAYMENTS === */
export const processPayment = async (orderId: number, paymentData: any) =>
  api.post(`/v1/orders/${orderId}/pay`, paymentData);

export const getPaymentDetails = async (orderId: number) =>
  api.get(`/v1/orders/${orderId}/payment`);

/* === FEEDBACK === */
export const submitFeedback = async (feedbackData: any) =>
  api.post("/v1/feedback", feedbackData);

export const getMyFeedbacks = async () =>
  api.get("/v1/feedback/my-feedbacks");

/* === ADMIN === */
export const getAdminDashboard = async () => 
  api.get("/v1/admin/dashboard");

export const getAllOrders = async () => 
  api.get("/v1/admin/orders");

export const getAllCustomers = async () => 
  api.get("/v1/admin/customers");

export const createRestaurant = async (restaurantData: any) => 
  api.post("/v1/admin/restaurants", restaurantData);

export const updateRestaurant = async (id: number, restaurantData: any) => 
  api.put(`/v1/admin/restaurants/${id}`, restaurantData);

export const deleteRestaurant = async (id: number) => 
  api.delete(`/v1/admin/restaurants/${id}`);