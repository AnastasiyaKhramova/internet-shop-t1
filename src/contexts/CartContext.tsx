import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchCartByUser, selectCartStatus, selectCartError, Cart } from '../slice/cartSlice';
import useUser from '../hooks/useUser';

interface CartContextProps {
    cart: Cart | null; 
    cartStatus: string;
    cartError: string | null;
    reloadCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCartContext = (): CartContextProps => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch: AppDispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.cart);
    const cartStatus = useSelector(selectCartStatus);
    const cartError = useSelector(selectCartError);
    const { user } = useUser();

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCartByUser(user.id));
        }
    }, [dispatch, user]);

    const reloadCart = () => {
        if (user?.id) {
            dispatch(fetchCartByUser(user.id));
        }
    };

    return (
        <CartContext.Provider value={{ cart, cartStatus, cartError, reloadCart }}>
            {children}
        </CartContext.Provider>
    );
};
