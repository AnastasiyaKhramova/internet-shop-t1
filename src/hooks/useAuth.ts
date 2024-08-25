import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { setUser } from '../slice/userSlice';
import { getToken, setToken, removeToken } from '../utils/auth';
import { fetchUserByToken } from '../api/authApi';
import { fetchCartByUser } from '../slice/cartSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

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
                    navigate('/login');
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
            console.log('Login response data:', data);

            if (!data || !data.token || !data.id) {
                throw new Error('Invalid response data');
            }

            setToken(data.token);
            dispatch(setUser(data));
            setIsAuthenticated(true);
            dispatch(fetchCartByUser(data.id));
            console.log('Token in localStorage:', localStorage.getItem('token'));
            navigate('/'); 

        } catch (error) {
            console.error('Login error', error);
            throw error;
        }
    };

    const logout = () => {
        removeToken();
        dispatch(setUser(null));
        setIsAuthenticated(false);
        navigate('/login');;
    };

    return { login, logout, loading, isAuthenticated };
};
