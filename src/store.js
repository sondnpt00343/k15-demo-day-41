import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/product/productSlice";
import { productApi } from "@/services/product";

const store = configureStore({
    reducer: {
        product: productReducer,
        [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        productApi.middleware,
    ],
});

window.store = store;

export { store };
