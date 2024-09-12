import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, addProductToCart, removeProductFromCart, selectCart, createCart, CartProduct } from '../slice/cartSlice';
import { AppDispatch } from '../store/store';

const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector(selectCart);
  const token = localStorage.getItem('token');
  const cartId = localStorage.getItem('cartId');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (token) {
      if (cartId) {
        dispatch(fetchCart(token));
      } else if (userId) {
        dispatch(createCart({ userId: Number(userId), token }));
      } else {
        console.error("User ID is missing. Cannot create cart.");
      }
    }
  }, [dispatch, cartId, token, userId]);

  const addToCart = useCallback((product: CartProduct) => {
    if (cart && token) {
      dispatch(addProductToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage,
        thumbnail: product.thumbnail,
        quantity: 1,
        total: product.price * 1,
        discountTotal: (product.price * 1) * (product.discountPercentage / 100),
      }));
    }
  }, [dispatch, cart, token]);

  const removeFromCart = useCallback((productId: number) => {
    if (cart && token) {
      dispatch(removeProductFromCart(productId));
    }
  }, [dispatch, cart, token]);

  return {
    cart,
    addToCart,
    removeFromCart,
  };
};

export default useCart;