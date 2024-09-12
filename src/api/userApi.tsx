import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../hooks/useUser';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
    endpoints: (builder) => ({
        getCurrentUser: builder.query<User, string>({
            query: (token) => ({
                url: '/user/me',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
    }),
});

export const { useGetCurrentUserQuery } = userApi;

