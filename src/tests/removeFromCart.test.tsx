import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { addToCart, removeFromCart, CartProduct, CartState } from '../slice/cartSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

describe('Cart Slice - removeFromCart', () => {
    beforeEach(() => {
        store.dispatch({ type: 'cart/clearCart' });
    });

    it('should decrease product quantity if more than 1', () => {
        const product: CartProduct = {
            id: 1,
            title: 'Test Product',
            price: 100,
            discountPercentage: 10,
            quantity: 2,
            thumbnail: 'test-thumbnail.jpg'
        };

        store.dispatch(addToCart(product));
        store.dispatch(removeFromCart(product.id));

        const state = store.getState().cart as CartState;
        const updatedProduct = state.cart?.products.find(p => p.id === product.id);

        expect(updatedProduct?.quantity).toBe(1);
        expect(state.cart?.totalQuantity).toBe(1);
        expect(state.cart?.totalPrice).toBe(90);
    });

    it('should remove product completely if quantity is 1', () => {
        const product: CartProduct = {
            id: 1,
            title: 'Test Product',
            price: 100,
            discountPercentage: 10,
            quantity: 1,
            thumbnail: 'test-thumbnail.jpg'
        };

        store.dispatch(addToCart(product));
        store.dispatch(removeFromCart(product.id));

        const state = store.getState().cart as CartState;

        expect(state.cart?.products.length).toBe(0);
        expect(state.cart?.totalQuantity).toBe(0);
        expect(state.cart?.totalPrice).toBe(0);
    });
});
