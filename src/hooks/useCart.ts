import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCart,
  addProductToCart,
  removeProductFromCart,
  removeAllQuantityFromProduct,
  selectCart,
  createCart,
  CartProduct,
  setCart,
} from '../slice/cartSlice';
import { AppDispatch } from '../store/store';
import { loadCartFromLocalStorage } from '../utils/localstorage';

const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector(selectCart);
  const token = localStorage.getItem('token');
  const userId = Number(localStorage.getItem('userId'));
  const cartId = localStorage.getItem('cartId');

  useEffect(() => {
    const cartFromStorage = loadCartFromLocalStorage();
    console.log(cartFromStorage)
    if (cartFromStorage) {
      dispatch(setCart(cartFromStorage));
    }
    if (token) {
      if (cartId) {
        if (!cartFromStorage || cartFromStorage.products.length === 0 && userId === cartFromStorage.id) {
          dispatch(fetchCart(token));
        }
      } else if (userId) {
        dispatch(createCart({ userId: Number(userId), token }));
      }
    }
  }, [dispatch, cartId, token, userId]);

  const addToCart = useCallback((product: CartProduct) => {
    if (cart) {
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
  }, [dispatch, cart]);

  const removeFromCart = useCallback((productId: number) => {
    if (cart) {
      dispatch(removeProductFromCart(productId));
    }
  }, [dispatch, cart]);

  const removeAllFromCart = useCallback ((productId: number) => {
    if (cart) {
      dispatch(removeAllQuantityFromProduct(productId));
    }
  }, [dispatch, cart]);
 

  return {
    cart,
    addToCart,
    removeFromCart,
    removeAllFromCart
  };
};

export default useCart;
