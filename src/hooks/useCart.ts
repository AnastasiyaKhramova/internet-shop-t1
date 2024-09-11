import { useState, useEffect, useCallback } from 'react';

const useCart = () => {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<{ [key: number]: number }>({});
  const token = localStorage.getItem('token');

  const updateCartInStorage = (updatedCartCount: { [key: number]: number }) => {
    localStorage.setItem('cart', JSON.stringify(updatedCartCount));
  };

  useEffect(() => {
    const storedCartCount = localStorage.getItem('cart');
    if (storedCartCount) {
        setCartCount(JSON.parse(storedCartCount));
    }

    const storedCartId = localStorage.getItem('cartId');
    if (storedCartId) {
      setCartId(storedCartId);
      fetchCart(storedCartId);
    } else {
      createCart();
    }
  }, []);

  const createCart = async () => {
    try {
      const response = await fetch('https://yourapi.com/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ products: [] }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartId(data.id);
        localStorage.setItem('cartId', data.id);
      } else {
        console.error('Failed to create cart');
      }
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  };

  const fetchCart = async (id: string) => {
    try {
      const response = await fetch(`https://yourapi.com/carts/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const countMap: { [key: number]: number } = {};
        data.products.forEach((product: any) => {
          countMap[product.id] = product.quantity;
        });
        setCartCount(countMap);
        updateCartInStorage(countMap); 
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateCart = async (products: { id: number, quantity: number }[]) => {
    if (!cartId) return;

    try {
      const response = await fetch(`https://yourapi.com/carts/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ products, merge: false }),
      });

      if (response.ok) {
        setCartCount(() => {
          const updatedCount: { [key: number]: number } = {};
          products.forEach(product => {
            updatedCount[product.id] = product.quantity;
          });
          updateCartInStorage(updatedCount);
          return updatedCount;
        });
      } else {
        console.error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const addToCart = useCallback((productId: number) => {
    setCartCount(prevCartCount => {
      const updatedCount = {
        ...prevCartCount,
        [productId]: (prevCartCount[productId] || 0) + 1
      };
      updateCart(Object.keys(updatedCount).map(id => ({
        id: Number(id),
        quantity: updatedCount[Number(id)]
      })));
      updateCartInStorage(updatedCount);
      return updatedCount;
    });
  }, [updateCart]);

  const removeFromCart = useCallback((productId: number) => {
    setCartCount(prevCartCount => {
      const newCartCount = { ...prevCartCount };
      if (newCartCount[productId] > 1) {
        newCartCount[productId]--;
      } else {
        delete newCartCount[productId];
      }
      updateCart(Object.keys(newCartCount).map(id => ({
        id: Number(id),
        quantity: newCartCount[Number(id)]
      })));
      updateCartInStorage(newCartCount);
      return newCartCount;
    });
  }, [updateCart]);

  return {
    cartCount,
    addToCart,
    removeFromCart,
  };
};

export default useCart;
