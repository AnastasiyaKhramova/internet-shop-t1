import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {
    loadCartFromLocalStorage,
    saveCartToLocalStorage,
} from "../utils/localstorage";
import { fetchCartFromAPI } from "../utils/cart";

export interface CartProduct {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    quantity: number;
    total: number;
    discountTotal: number;
    thumbnail: string;
}

export interface Cart {
    id?: number;
    totalProducts?: number;
    totalQuantity?: number;
    total?: number;
    discountedTotal?: number;
    userId?: number;
    products: CartProduct[];
}

export interface CartState {
    cart: Cart | null;
    cartId: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CartState = {
    cart: loadCartFromLocalStorage(),
    cartId: localStorage.getItem("cartId"),
    status: "idle",
    error: null,
};

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (token: string, thunkAPI) => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            try {
                const data = await fetchCartFromAPI(userId, token);
                const cart: Cart = {
                    id: data.id,
                    totalProducts: data.totalProducts,
                    totalQuantity: data.totalQuantity,
                    total: data.total,
                    products: data.products.map((product: CartProduct) => ({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        quantity: product.quantity,
                        discountPercentage: product.discountPercentage,
                        thumbnail: product.thumbnail,
                        discountTotal: product.discountTotal,
                        total: product.total,
                    })),
                };
                saveCartToLocalStorage(cart);
                return { userId, cart };
            } catch (error: any) {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
        return thunkAPI.rejectWithValue("No user ID found");
    }
);

export const createCart = createAsyncThunk(
    "cart/createCart",
    async ({ userId, token }: { userId: number; token: string }, thunkAPI) => {
        try {
            if (!userId) {
                return thunkAPI.rejectWithValue("User ID is required");
            }

            const state = thunkAPI.getState() as RootState;
            const cartProducts = state.cart.cart?.products ?? [];

            if (cartProducts.length === 0) {
                return thunkAPI.rejectWithValue("Cannot create cart without products");
            }

            const response = await fetch("https://dummyjson.com/carts/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    products: cartProducts.map((product: CartProduct) => ({
                        id: product.id,
                        quantity: product.quantity,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create cart: ${response.statusText}`);
            }

            const data = await response.json();
            localStorage.setItem("cartId", data.id.toString());
            return { cartId: data.id, cart: data };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateCart = createAsyncThunk(
    "cart/updateCart",
    async (
        {
            products,
            token,
        }: {
            products: { id: number; quantity: number }[];
            token: string;
        },
        thunkAPI
    ) => {
        const cartId = localStorage.getItem("cartId");
        if (cartId) {
            try {
                const currentCart = loadCartFromLocalStorage();

                if (!currentCart) {
                    return thunkAPI.rejectWithValue("Корзина не найдена в localStorage");
                }

                const updatedProducts = currentCart.products.map((product) => {
                    const updatedProduct = products.find((p) => p.id === product.id);
                    return updatedProduct
                        ? { ...product, quantity: updatedProduct.quantity }
                        : product;
                });

                const updatedCart: Cart = {
                    ...currentCart,
                    products: updatedProducts,
                    totalQuantity: updatedProducts.reduce(
                        (acc, p) => acc + p.quantity,
                        0
                    ),
                    total: updatedProducts.reduce(
                        (acc, p) => acc + p.price * p.quantity,
                        0
                    ),
                };

                saveCartToLocalStorage(updatedCart);

                const response = await fetch(`https://dummyjson.com/carts/${cartId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        products: updatedProducts.map((product) => ({
                            id: product.id,
                            quantity: product.quantity,
                        })),
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Ошибка при обновлении корзины: ${errorData.message}`);
                }

                return updatedCart;
            } catch (error: any) {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
        return thunkAPI.rejectWithValue("Cart ID не найден");
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addProductToCart: (
            state,
            action: PayloadAction<CartProduct>
        ) => {
            if (state.cart) {
                const productIndex = state.cart.products.findIndex(
                    (p) => p.id === action.payload.id
                );

                if (productIndex > -1) {
                    state.cart.products[productIndex].quantity += action.payload.quantity;
                } else {
                    state.cart.products.push(action.payload);
                }

                state.cart.totalProducts = state.cart.products.length;
                state.cart.totalQuantity = state.cart.products.reduce(
                    (acc, product) => acc + product.quantity,
                    0
                );
                state.cart.total = state.cart.products.reduce(
                    (acc, product) => acc + product.price * product.quantity,
                    0
                );
                saveCartToLocalStorage(state.cart);
            }
        },
        removeProductFromCart: (state, action: PayloadAction<number>) => {
            if (state.cart) {
                state.cart.products = state.cart.products.filter(
                    (p) => p.id !== action.payload
                );

                state.cart.totalProducts = state.cart.products.length;
                state.cart.totalQuantity = state.cart.products.reduce(
                    (acc, product) => acc + product.quantity,
                    0
                );
                state.cart.total = state.cart.products.reduce(
                    (acc, product) => acc + product.price * product.quantity,
                    0
                );
                saveCartToLocalStorage(state.cart);
            }
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ id: number; quantity: number }>
        ) => {
            if (state.cart) {
                const productIndex = state.cart.products.findIndex(
                    (p) => p.id === action.payload.id
                );

                if (productIndex > -1) {
                    state.cart.products[productIndex].quantity = action.payload.quantity;
                }

                state.cart.totalProducts = state.cart.products.length;
                state.cart.totalQuantity = state.cart.products.reduce(
                    (acc, product) => acc + product.quantity,
                    0
                );
                state.cart.total = state.cart.products.reduce(
                    (acc, product) => acc + product.price * product.quantity,
                    0
                );
                saveCartToLocalStorage(state.cart);
            }
        },
        clearCart: (state) => {
            state.cart = null;
            localStorage.removeItem("cartId");
        },
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cart = action.payload.cart;
                state.cartId = action.payload.userId;
                state.status = "succeeded";
                saveCartToLocalStorage(state.cart);
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.status = "succeeded";
                saveCartToLocalStorage(state.cart);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.error = action.payload as string;
                state.status = "failed";
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.error = action.payload as string;
                state.status = "failed";
            });
    },
});

export const { addProductToCart, removeProductFromCart, updateQuantity, clearCart } = cartSlice.actions


export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
