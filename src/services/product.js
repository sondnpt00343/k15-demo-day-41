import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery,
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/products",
        }),
        createProduct: builder.mutation({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body,
                headers: {
                    Authorization: "Bearer <token>",
                },
            }),
        }),
    }),
});

export const { useGetProductsQuery, useCreateProductMutation } = productApi;
