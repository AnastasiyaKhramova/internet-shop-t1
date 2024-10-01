import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  loadCartFromLocalStorage,
  saveCartToLocalStorage,
} from "../utils/localstorage";
import { fetchCartFromAPI } from "../utils/cart";
import { useAuth } from "./AuthContext";
import { Cart } from "../slice/cartSlice";

interface CartContextProps {
  cart: Cart | null;
  refreshCart: () => void;
  cartStatus: "idle" | "loading" | "succeeded" | "failed";
  cartError: string | null;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextProps | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(loadCartFromLocalStorage());
  const [cartStatus, setCartStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [cartError, setCartError] = useState<string | null>(null);
  const authContext = useAuth();

  useEffect(() => {
    if (authContext?.isAuthenticated && !cart) {
      refreshCart();
    }
  }, [authContext?.isAuthenticated, cart]);

  const refreshCart = async () => {
    setCartStatus("loading");
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const data = await fetchCartFromAPI(userId, token);
        setCart(data);
        saveCartToLocalStorage(data);
        setCartStatus("succeeded");
      } else {
        setCartError("Token or user ID not found");
        setCartStatus("failed");
      }
    } catch (error) {
      console.error("Error refreshing cart:", error);
      setCartError("An unknown error occurred");
      setCartStatus("failed");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, refreshCart, cartStatus, cartError }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
