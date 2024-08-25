import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
    endpoints: (builder) => ({
        getCurrentUser: builder.query<null, string>({
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
