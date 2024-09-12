import { useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../utils/auth';
import { fetchUserByToken } from '../api/authApi';
import { fetchCart } from '../slice/cartSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { setUser } from '../slice/userSlice';

export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const token = getToken();

        if (token) {
            fetchUserByToken(token)
                .then(user => {
                    dispatch(setUser(user));
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

            if (!response.ok) {
                throw new Error('Failed to login');
            }

            const data = await response.json();

            if (!data || !data.token || !data.id) {
                throw new Error('Invalid response data');
            }

            setToken(data.token);
            dispatch(setUser(data));
            setIsAuthenticated(true);
            dispatch(fetchCart(data.id));
        } catch (error) {
            console.error('Login error', error);
            throw error;
        }
    };

    const logout = () => {
        removeToken();
        dispatch(setUser(null));
        setIsAuthenticated(false);
    };

    return { login, logout, loading, isAuthenticated };
};
