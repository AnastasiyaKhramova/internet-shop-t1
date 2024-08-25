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

export const fetchCartByUser = createAsyncThunk(
    'cart/fetchCartByUser',
    async (userId: number, thunkAPI) => {
        try {
            const response = await fetch(`https://dummyjson.com/carts/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            const data = await response.json();
            if (data.carts.length > 0) {
                return data.carts[0];
            } else {
                return null;
            }
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
            if (state.cart) {
                const product = state.cart.products.find(p => p.id === action.payload.id);
                if (product) {
                    product.quantity++;
                } else {
                    state.cart.products.push(action.payload);
                }
                state.cart.totalQuantity++;
                state.cart.totalPrice += action.payload.price * (1 - action.payload.discountPercentage / 100);
            } else {
                state.cart = {
                    id: Date.now(),
                    totalProducts: 1,
                    totalQuantity: 1,
                    totalPrice: action.payload.price * (1 - action.payload.discountPercentage / 100),
                    totalDiscount: action.payload.discountPercentage,
                    products: [action.payload]
                };
            }
            saveCartToLocalStorage(state.cart);  
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            if (state.cart) {
                const productIndex = state.cart.products.findIndex(p => p.id === action.payload);
                if (productIndex >= 0) {
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
                }
                if (state.cart.products.length === 0) {
                    state.cart = null;
                }
            }
            saveCartToLocalStorage(state.cart);  
        },

        updateQuantity: (state, action: PayloadAction<{ id: number, quantity: number }>) => {
            if (state.cart && state.cart.products) { 
                const product = state.cart.products.find(p => p.id === action.payload.id);
                if (product) {
                    const oldQuantity = product.quantity;
                    product.quantity = action.payload.quantity;
                    state.cart.totalQuantity += (action.payload.quantity - oldQuantity);
                    state.cart.totalPrice += product.price * (1 - product.discountPercentage / 100) * (action.payload.quantity - oldQuantity);
                }
            }
            saveCartToLocalStorage(state.cart);  
        },
        
        clearCart: (state) => {
            state.cart = null;
            saveCartToLocalStorage(null);  
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
