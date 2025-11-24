// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "@/features/product/productSlice";

import {
    useCreateProductMutation,
    useGetProductsQuery,
} from "@/services/product";

function Home() {
    // const dispatch = useDispatch();
    // const products = useSelector((state) => state.product.products);

    // useEffect(() => {
    //     dispatch(fetchProducts());
    // }, [dispatch]);

    const { isLoading, data } = useGetProductsQuery();
    const [createProduct, newProductResponse] = useCreateProductMutation();

    console.log(newProductResponse);

    const handleCreateProduct = () => {
        createProduct({
            title: "New product",
        });
    };

    return (
        <div>
            <button onClick={handleCreateProduct}>Create new product</button>

            <h1>Products</h1>
            <ul>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    data.data.items.map((product) => (
                        <li key={product.id}>
                            {product.id}. {product.title}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default Home;
