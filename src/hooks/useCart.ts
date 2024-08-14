import { useState, useCallback } from 'react';

const useCart = () => {
    const [cartCount, setCartCount] = useState<{ [key: number]: number }>({});

    const addToCart = useCallback((productId: number) => {
        setCartCount(prevCartCount => ({
            ...prevCartCount,
            [productId]: (prevCartCount[productId] || 0) + 1
        }));
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setCartCount(prevCartCount => {
            const newCartCount = { ...prevCartCount };
            if (newCartCount[productId] > 1) {
                newCartCount[productId]--;
            } else {
                delete newCartCount[productId];
            }
            return newCartCount;
        });
    }, []);

    return {
        cartCount,
        addToCart,
        removeFromCart,
    };
};

export default useCart;
