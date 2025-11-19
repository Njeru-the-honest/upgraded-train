import React, { createContext, useState, useEffect, ReactNode } from "react";
import { MenuItem, CartItem } from "../types";
import toast from "react-hot-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0,
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fix 1: Load cart safely (This fixes any OLD broken data in storage)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        
        // SAFETY CHECK: If any item has a null/missing quantity, force it to 1
        const sanitizedCart = parsedCart.map((item: any) => ({
          ...item,
          quantity: item.quantity || 1 
        }));

        setCartItems(sanitizedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fix 2: Add to cart safely (This prevents NEW broken data)
  const addToCart = (item: MenuItem, quantity: number) => {
    // FORCE VALID QUANTITY: If quantity is missing, null, or 0, default to 1
    const safeQuantity = (quantity && quantity > 0) ? quantity : 1;

    console.log("Adding to cart:", item, "Safe Quantity:", safeQuantity);
    
    if (!item.restaurantId) {
      console.error("MenuItem missing restaurantId:", item);
      toast.error("Cannot add item: Restaurant information missing");
      return;
    }
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        return prevItems.map((i) =>
          // Use safeQuantity here to prevent null/NaN
          i.id === item.id ? { ...i, quantity: i.quantity + safeQuantity } : i
        );
      }
      
      const cartItem: CartItem = {
        ...item,
        // Use safeQuantity here to prevent null/NaN
        quantity: safeQuantity,
        restaurantId: item.restaurantId
      };
      
      return [...prevItems, cartItem];
    });
    
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountPercentage 
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price;
      // Safety check in calculation as well
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const getTotalItems = () => {
    // Safety check in count calculation
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};