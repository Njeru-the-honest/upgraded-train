export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  address?: string;
  imageUrl?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  restaurantId: number;
  imageUrl?: string;
  available?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress?: string;
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  price: number;
  menuItem?: MenuItem;
}
