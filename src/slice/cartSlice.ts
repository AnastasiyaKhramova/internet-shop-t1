import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { loadCartFromLocalStorage, saveCartToLocalStorage } from '../utils/localstorage'; 

export interface CartProduct {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    quantity: number;
    thumbnail: string;
}

export interface Cart {
    id: number;
    totalProducts: number;
    totalQuantity: number;
    totalPrice: number;
    totalDiscount: number;
    products: CartProduct[];
}

export interface CartState {
    cart: Cart | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CartState = {
    cart: loadCartFromLocalStorage(),  
    status: 'idle',
    error: null,
};

const updateCartStorage = (cart: Cart | null) => {
    saveCartToLocalStorage(cart);
};

export const fetchCartByUser = createAsyncThunk(
    'cart/fetchCartByUser',
    async (userId: number, thunkAPI) => {
        try {
            const response = await fetch(`https://dummyjson.com/carts/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            const data = await response.json();
            return data.carts.length > 0 ? data.carts[0] : null;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async ({ cartId, products, merge = true, headers }: { cartId: string, products: { id: number, quantity: number }[], merge?: boolean, headers: { Authorization: string } }, thunkAPI) => {
        try {
            const response = await fetch(`https://dummyjson.com/carts/${cartId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: JSON.stringify({ products, merge })
            });
            if (!response.ok) {
                throw new Error('Failed to update cart');
            }
            return await response.json();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartProduct>) => {
            if (!state.cart) {
                state.cart = {
                    id: Date.now(),
                    totalProducts: 0,
                    totalQuantity: 0,
                    totalPrice: 0,
                    totalDiscount: 0,
                    products: []
                };
            }

            const existingProduct = state.cart.products.find(p => p.id === action.payload.id);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                state.cart.products.push(action.payload);
            }

            state.cart.totalQuantity++;
            state.cart.totalPrice += action.payload.price * (1 - action.payload.discountPercentage / 100);
            state.cart.totalProducts = state.cart.products.length;

            updateCartStorage(state.cart);
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            if (!state.cart) return;

            const productIndex = state.cart.products.findIndex(p => p.id === action.payload);
            if (productIndex === -1) return;

            const product = state.cart.products[productIndex];

            if (product.quantity > 1) {
                product.quantity--;
                state.cart.totalQuantity--;
                state.cart.totalPrice -= product.price * (1 - product.discountPercentage / 100);
            } else {
                state.cart.products.splice(productIndex, 1);
                state.cart.totalQuantity--;
                state.cart.totalPrice -= product.price * (1 - product.discountPercentage / 100);
            }

            state.cart.totalProducts = state.cart.products.length;

            if (state.cart.products.length === 0) {
                state.cart = null;
            }

            updateCartStorage(state.cart);
        },
        updateQuantity: (state, action: PayloadAction<{ id: number, quantity: number }>) => {
            if (!state.cart) return;

            const product = state.cart.products.find(p => p.id === action.payload.id);
            if (!product) return;

            const quantityDifference = action.payload.quantity - product.quantity;

            product.quantity = action.payload.quantity;
            state.cart.totalQuantity += quantityDifference;
            state.cart.totalPrice += product.price * (1 - product.discountPercentage / 100) * quantityDifference;

            updateCartStorage(state.cart);
        },
        clearCart: (state) => {
            state.cart = null;
            updateCartStorage(null);
        },
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartByUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCartByUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchCartByUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload || state.cart;  
                saveCartToLocalStorage(state.cart);  
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.cart = action.payload || state.cart;
                state.status = 'succeeded';
                saveCartToLocalStorage(state.cart);  
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
