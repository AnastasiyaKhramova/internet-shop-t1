import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  endpoints: (builder) => ({
  
    searchProducts: builder.query({
      query: ({ q, limit, skip }) => `products/search?q=${q}&limit=${limit}&skip=${skip}`,
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
    }),

    updateCart: builder.mutation({
      query: ({ cartId, products }) => ({
        url: `carts/${cartId}`,
        method: 'PUT',
        body: { merge: false, products },
      }),
    }),

    getCart: builder.query({
      query: (cartId) => `carts/${cartId}`,
    }),
  }),
});

export const { useSearchProductsQuery, useGetProductQuery, useUpdateCartMutation, useGetCartQuery } = productsApi;
