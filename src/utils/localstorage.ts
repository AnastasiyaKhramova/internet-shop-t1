import { Cart } from '../slice/cartSlice'; 

export const getCartFromLocalStorage = () => {
    const cartData = localStorage.getItem('cart');
    try {
        const parsedCart = JSON.parse(cartData || '{}');
        if (
            typeof parsedCart === 'object' &&
            parsedCart !== null &&
            Array.isArray(parsedCart.products)
        ) {
            return parsedCart.products;
        }
        return [];
    } catch (e) {
        console.error('Error parsing cart data from localStorage:', e);
        return [];
    }
};

export const loadCartFromLocalStorage = (): Cart | null => {
    try {
        const serializedCart = localStorage.getItem('cart');
        return serializedCart ? JSON.parse(serializedCart) : null;
    } catch (error) {
        console.error("Could not load cart from localStorage", error);
        return null;
    }
};

export const saveCartToLocalStorage = (cart: Cart | null) => {
    try {
        const serializedCart = JSON.stringify(cart);
        localStorage.setItem('cart', serializedCart);
    } catch (error) {
        console.error("Could not save cart to localStorage", error);
    }
};

