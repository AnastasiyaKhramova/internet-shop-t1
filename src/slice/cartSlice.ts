import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

export interface CartProduct {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    quantity: number;
    thumbnail: string;
}

interface Cart {
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
    cart: null,
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
            return data.carts[0];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartByUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCartByUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload;
            })
            .addCase(fetchCartByUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;