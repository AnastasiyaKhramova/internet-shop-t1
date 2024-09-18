import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadCartFromLocalStorage, saveCartToLocalStorage } from '../utils/localstorage';
import { fetchCartFromAPI } from '../utils/cart';
import { useAuth } from './AuthContext';
import { Cart } from '../slice/cartSlice';

interface CartContextProps {
    cart: Cart | null;
    refreshCart: () => void;
}

interface CartProviderProps {
    children: ReactNode;
}

const CartContext = createContext<CartContextProps | null>(null);

export const useCart = () => useContext(CartContext);

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(loadCartFromLocalStorage());
    const authContext = useAuth(); 
    
    useEffect(() => {
        if (authContext?.isAuthenticated && cart === null) {
            refreshCart();
        }
    }, [authContext?.isAuthenticated]);  

    const refreshCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (token && userId) {
                const data = await fetchCartFromAPI(userId, token);
                setCart(data);
                saveCartToLocalStorage(data);
            }
        } catch (error) {
            console.error('Error refreshing cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
