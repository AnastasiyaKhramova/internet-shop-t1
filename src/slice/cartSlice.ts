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

export const selectCartCount = (state: RootState): { [key: number]: number } => {
    return state.cart.cart?.products.reduce((count, product) => {
        count[product.id] = product.quantity;
        return count;
    }, {} as { [key: number]: number }) || {};;
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

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            if (state.cart) {
                const product = state.cart.products.find(p => p.id === action.payload);
                if (product) {
                    product.quantity++;
                } 
            }

        },
        removeFromCart: (state, action) => {
            if (state.cart) {
                const productIndex = state.cart.products.findIndex(p => p.id === action.payload);
                if (productIndex >= 0) {
                    const product = state.cart.products[productIndex];
                    if (product.quantity > 1) {
                        product.quantity--;
                        console.log(`Removed ${product.title}, new quantity: ${product.quantity}`);
                    } else {
                        state.cart.products.splice(productIndex, 1);
                    }
                }
            }
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
                state.cart = action.payload || null;
            })
    }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;