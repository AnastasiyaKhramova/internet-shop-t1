export const fetchUserByToken = async (token: string) => {
    const response = await fetch('https://dummyjson.com/auth/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
};
