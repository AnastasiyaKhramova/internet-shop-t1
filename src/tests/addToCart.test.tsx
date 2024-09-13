import { describe, it, expect } from '@jest/globals'; 
import cartReducer, { addToCart, CartState, CartProduct } from '../slice/cartSlice'; 

const initialState: CartState = {
    cart: null,
    status: 'idle',
    error: null,
};

describe('cartSlice', () => {
    it('should add a new product to the cart when the cart is empty', () => {
        const product: CartProduct = {
            id: 1,
            title: 'Test Product',
            price: 100,
            discountPercentage: 10,
            quantity: 1,
            thumbnail: 'test-thumbnail.jpg',
        };

        const newState = cartReducer(initialState, addToCart(product));

        expect(newState.cart).not.toBeNull();
        expect(newState.cart?.products).toHaveLength(1);
        expect(newState.cart?.products[0]).toEqual(product);
        expect(newState.cart?.totalQuantity).toBe(1);
        expect(newState.cart?.totalPrice).toBe(product.price * (1 - product.discountPercentage / 100));
    });

    it('should increase the quantity of an existing product in the cart', () => {
        const initialProduct: CartProduct = {
            id: 1,
            title: 'Test Product',
            price: 100,
            discountPercentage: 10,
            quantity: 1,
            thumbnail: 'test-thumbnail.jpg',
        };

        const initialStateWithProduct: CartState = {
            cart: {
                id: 1,
                totalProducts: 1,
                totalQuantity: 1,
                totalPrice: initialProduct.price * (1 - initialProduct.discountPercentage / 100),
                totalDiscount: initialProduct.discountPercentage,
                products: [initialProduct],
            },
            status: 'idle',
            error: null,
        };

        const productToAdd: CartProduct = {
            id: 1,
            title: 'Test Product',
            price: 100,
            discountPercentage: 10,
            quantity: 2,
            thumbnail: 'test-thumbnail.jpg',
        };

        const newState = cartReducer(initialStateWithProduct, addToCart(productToAdd));

        expect(newState.cart?.products).toHaveLength(1);
        expect(newState.cart?.products[0].quantity).toBe(3); 
        expect(newState.cart?.totalQuantity).toBe(3);
        expect(newState.cart?.totalPrice).toBe(productToAdd.price * (1 - productToAdd.discountPercentage / 100) * 3);
    });
});
