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
export const registerUser = async (data: { name: string; email: string; password: string }) => 
  api.post("/v1/auth/register", data);

export const loginUser = async (data: { email: string; password: string }) => 
  api.post("/v1/auth/login", data);

export const getUserProfile = async () => 
  api.get("/v1/users/me");

/* === RESTAURANTS === */
export const getRestaurants = async () => 
  api.get("/v1/restaurants");

export const getMenuByRestaurant = async (id: number) => 
  api.get(`/v1/restaurants/${id}/menu`);

/* === ORDERS === */
export const placeOrder = async (orderData: any) => 
  api.post("/v1/orders", orderData);

export const getUserOrders = async () => 
  api.get("/v1/orders/user");

export const getOrderDetails = async (id: number) => 
  api.get(`/v1/orders/${id}`);
