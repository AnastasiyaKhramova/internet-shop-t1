import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAppSelector, useAppDispatch } from "../store/store"; 
import { selectCart, fetchCart, Cart, setCart } from "../slice/cartSlice";
import { loadCartFromLocalStorage } from "../utils/localstorage";

interface CartContextProps {
  cart: Cart | null;
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
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  
  useEffect(() => {
    const savedCart = loadCartFromLocalStorage();
    if (savedCart) {
      dispatch(setCart(savedCart));
    }
  }, [dispatch]);

  return (
    <CartContext.Provider value={{ cart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
