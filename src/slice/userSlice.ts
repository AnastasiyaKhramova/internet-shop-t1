import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState  {
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        username: string;
    } | null;
    loading: boolean;
}

const initialState: AuthState  = {
    user: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthState ['user']>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
