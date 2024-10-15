import { Cart } from '../slice/cartSlice'; 

export const loadCartFromLocalStorage = (): Cart | null => {
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : null;
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
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