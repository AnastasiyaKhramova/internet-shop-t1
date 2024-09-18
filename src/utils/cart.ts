import { Cart } from '../slice/cartSlice'; 

export const fetchCartFromAPI = async (userId: string, token: string): Promise<Cart> => {
    try {
        const response = await fetch(`https://dummyjson.com/users/${userId}/cart`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart from API');
        }

        const cart = await response.json();
        return cart;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const updateCartOnAPI = async (userId: string, token: string, cartData: Cart): Promise<Cart> => {
    try {
        const response = await fetch(`https://dummyjson.com/users/${userId}/cart`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartData)
        });

        if (!response.ok) {
            throw new Error('Failed to update cart on API');
        }

        const updatedCart = await response.json();
        return updatedCart;
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
};
