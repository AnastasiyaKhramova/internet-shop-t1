import { Cart } from "../slice/cartSlice";

export const fetchCartFromAPI = async (cartId: string, token: string): Promise<Cart> => {
  try {
    const response = await fetch(`https://dummyjson.com/carts/${cartId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Failed to fetch cart: ${response.status} ${errorResponse.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error; 
  }
};

export const updateCartInAPI = async (
  cartId: string,
  products: { id: number; quantity: number }[],
  token: string,
  merge: boolean = false
): Promise<Cart> => {
  try {
    const response = await fetch(`https://dummyjson.com/carts/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ products, merge }),
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Failed to update cart: ${response.status} ${errorResponse.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error; 
  }
};
