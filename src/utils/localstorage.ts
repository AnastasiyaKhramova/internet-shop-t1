import { Cart } from '../slice/cartSlice'; 

export const loadCartFromLocalStorage = (): Cart | null => {
    try {
        const serializedCart = localStorage.getItem('cart');
        if (!serializedCart) return null;

        const cart = JSON.parse(serializedCart);

        if (typeof cart === 'object' && cart !== null && Array.isArray(cart.products)) {
            return cart;
        }
        return null;
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        return null;
    }
};

export const saveCartToLocalStorage = (cart: Cart): void => {
    try {
        const serializedCart = JSON.stringify(cart);
        localStorage.setItem('cart', serializedCart);
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
};