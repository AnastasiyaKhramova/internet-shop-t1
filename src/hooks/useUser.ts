import { useEffect, useState } from 'react';
import { useGetCurrentUserQuery } from '../api/userApi'; 
import { getToken } from '../utils/auth'; 

export interface User {
    id: number;
    token: string;
    firstName: string;
    lastName: string;
}

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const token = getToken(); 

    const { data, error, isLoading } = useGetCurrentUserQuery(token ?? '', {
        skip: !token,
    });

    useEffect(() => {
        if (!token) { 
            setLoading(false);
            return;
        }

        if (isLoading) {
            setLoading(true); 
        } else if (data) {
            setUser(data); 
            setLoading(false);
        } else if (error) {
            setLoading(false);
        }
    }, [data, error, isLoading, token]);

    return { user, loading};
};

export default useUser;
