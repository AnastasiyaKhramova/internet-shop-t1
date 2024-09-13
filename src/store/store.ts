import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slice/cartSlice';
import { productsApi } from '../api/productApi';
import { userApi } from '../api/userApi';
import userReducer from '../slice/userSlice';


export const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
