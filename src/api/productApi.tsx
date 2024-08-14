import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/'}),
  endpoints: (builder) => ({
    searchProducts: builder.query({
      query: ({ q, limit, skip }) => `products?q=${q}&limit=${limit}&skip=${skip}`,
    }),
  }),
});

export const { useSearchProductsQuery } = productsApi;
