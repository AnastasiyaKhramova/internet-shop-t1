import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {
  loadCartFromLocalStorage,
  saveCartToLocalStorage,
} from "../utils/localstorage";
import { fetchCartFromAPI, updateCartInAPI } from "../utils/cart";

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
  cartCount: Cart | null;
  cartId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  cartCount: loadCartFromLocalStorage(),
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
            discountedTotal: product.discountTotal,
            total: product.total,
          })),
        };
        saveCartToLocalStorage(cart);
        return { userId, cart };
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
    return thunkAPI.rejectWithValue("No cart ID found");
  }
);

export const createCart = createAsyncThunk(
  "cart/createCart",
  async ({ userId, token }: { userId: number; token: string }, thunkAPI) => {
    try {
      if (!userId) {
        return thunkAPI.rejectWithValue("User id is required");
      }

      const state = thunkAPI.getState() as RootState;
      const cartProducts = state.cart.cartCount?.products ?? [];

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
        const errorData = await response.json();
        console.error("Create cart error:", errorData);
        throw new Error(`Failed to create cart: ${response.statusText}`);
      }

      const data = await response.json();
      localStorage.setItem("cartId", data.id.toString());
      return { cartId: data.id, cart: data };
    } catch (error) {
      console.error("Error creating cart:", error);
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
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
      merge: boolean;
      headers: { Authorization: string };
    },
    thunkAPI
  ) => {
    const cartId = localStorage.getItem("cartId");
    if (cartId) {
      try {
        const data = await updateCartInAPI(cartId, products, token);
        const updatedCart: Cart = {
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
            discountedTotal: product.discountTotal,
            total: product.total,
          })),
        };
        saveCartToLocalStorage(updatedCart);
        return updatedCart;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
    return thunkAPI.rejectWithValue("No cart ID found");
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cartCount = action.payload;
      saveCartToLocalStorage(state.cartCount);
    },
    addProductToCart: (
      state,
      action: PayloadAction<{
        id: number;
        title: string;
        price: number;
        discountPercentage: number;
        thumbnail: string;
        quantity: number;
        total: number;
        discountTotal: number;
      }>
    ) => {
      if (state.cartCount) {
        const productIndex = state.cartCount.products.find(
          (p) => p.id === action.payload.id
        );

        if (productIndex) {
          productIndex.quantity += 1;
        } else {
          state.cartCount.products.push({
            id: action.payload.id,
            title: action.payload.title,
            price: action.payload.price,
            discountPercentage: action.payload.discountPercentage,
            thumbnail: action.payload.thumbnail,
            quantity: action.payload.quantity,
            total: action.payload.total,
            discountTotal: action.payload.discountTotal,
          });
        }

        state.cartCount.totalProducts = state.cartCount.products.length;
        state.cartCount.totalQuantity = state.cartCount.products.reduce(
          (acc, product) => acc + product.quantity,
          0
        );
        state.cartCount.total = state.cartCount.products.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        );
        saveCartToLocalStorage(state.cartCount);
      }
    },
    removeProductFromCart: (state, action: PayloadAction<number>) => {
      if (state.cartCount) {
        const productIndex = state.cartCount.products.find(
          (p) => p.id === action.payload
        );

        if (productIndex) {
          productIndex.quantity -= 1;

          state.cartCount.totalProducts = state.cartCount.products.length;
          state.cartCount.totalQuantity = state.cartCount.products.reduce(
            (acc, product) => acc + product.quantity,
            0
          );
          state.cartCount.total = state.cartCount.products.reduce(
            (acc, product) => acc + product.price * product.quantity,
            0
          );
          saveCartToLocalStorage(state.cartCount);
        }
      }
    },
    deleteAllProductFromCart: (state, action: PayloadAction<number>) => {
      if (state.cartCount) {
        const productIndex = state.cartCount.products.findIndex(
          (p) => p.id === action.payload
        );

        if (productIndex > -1) {
          state.cartCount.products.splice(productIndex, 1);

          state.cartCount.totalProducts = state.cartCount.products.length;
          state.cartCount.totalQuantity = state.cartCount.products.reduce(
            (acc, product) => acc + product.quantity,
            0
          );
          state.cartCount.total = state.cartCount.products.reduce(
            (acc, product) => acc + product.price * product.quantity,
            0
          );
          saveCartToLocalStorage(state.cartCount);
        }
      }
    },
    clearCart: (state) => {
      state.cartCount = null;
      localStorage.removeItem("cartId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartCount = action.payload.cart;
        state.cartId = action.payload.userId;
        state.status = "succeeded";
        saveCartToLocalStorage(state.cartCount);
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.cartCount = action.payload;
        state.status = "succeeded";
        saveCartToLocalStorage(state.cartCount);
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

export const { addProductToCart, removeProductFromCart, clearCart, deleteAllProductFromCart } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart.cartCount;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
