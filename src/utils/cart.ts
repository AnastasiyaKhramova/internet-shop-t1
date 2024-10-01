export const fetchCartFromAPI = async (cartId: string, token: string) => {
  const response = await fetch(`https://dummyjson.com/carts/${cartId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Failed to fetch cart");
  }
};
export const updateCartInAPI = async (
  cartId: string,
  products: { id: number; quantity: number }[],
  token: string
) => {
  const response = await fetch(`https://dummyjson.com/carts/${cartId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ products, merge: false }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Failed to update cart");
  }
};
