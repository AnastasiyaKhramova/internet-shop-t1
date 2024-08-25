import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../api/userApi'; 
import { getToken } from '../utils/auth'; 

export interface User {
    id: number;
    firstName: string;
    lastName: string;
}

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = getToken(); 

    const { data, error, isLoading } = useGetCurrentUserQuery(token ?? '', {
        skip: !token,
    });

    useEffect(() => {
        if (!token) {
            navigate('/login'); 
            return;
        }

        if (isLoading) {
            setLoading(true); 
        } else if (data) {
            setUser(data); 
            setLoading(false);
        } else if (error) {
            navigate('/login');
        }
    }, [data, error, isLoading, token, navigate]);

    return { user, loading:isLoading };
};

export default useUser;
