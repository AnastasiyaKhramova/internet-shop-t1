import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../slice/userSlice';
import { getToken, setToken, removeToken } from '../utils/auth';
import { fetchUserByToken } from '../api/authApi';
import { fetchCart } from '../slice/cartSlice';
import { AppDispatch } from '../store/store';

interface AuthContextProps {
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}
interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const token = getToken();
        if (token) {
            fetchUserByToken(token)
                .then(user => {
                    dispatch(setUser(user));
                    dispatch(fetchCart(user.id));
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    removeToken();
                    setIsAuthenticated(false);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [dispatch]);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            setToken(data.token);
            dispatch(setUser(data));
            dispatch(fetchCart(data.id));
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error', error);
        }
    };

    const logout = () => {
        removeToken();
        dispatch(clearUser());
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
