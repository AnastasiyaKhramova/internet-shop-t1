import { removeToken } from '../utils/auth';

export const fetchUserByToken = async (token: string) => {
    if (!token) {
        throw new Error('No token provided');
    }

    const response = await fetch('https://dummyjson.com/auth/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            removeToken();
            throw new Error('Unauthorized. Token might be expired or invalid');
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
};
