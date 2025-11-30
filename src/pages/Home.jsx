import { useDevicesQuery, useMeQuery } from "@/services/auth";
import {
    useCreateProductMutation,
    // useGetProductsQuery,
} from "@/services/product";

function Home() {
    // const { isLoading, data: productData } = useGetProductsQuery();
    const [createProduct] = useCreateProductMutation();
    const { data: devices } = useDevicesQuery();

    console.log(devices);

    const { isSuccess, data: currentUser } = useMeQuery();

    const handleCreateProduct = () => {
        createProduct({
            title: "New product",
        });
    };

    return (
        <div>
            {isSuccess && <h2>Hi, {currentUser.firstName}</h2>}
            <button onClick={handleCreateProduct}>Create new product</button>
            <h1>Products</h1>
            {/* <ul>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    productData.items.map((product) => (
                        <li key={product.id}>
                            {product.id}. {product.title}
                        </li>
                    ))
                )}
            </ul> */}
        </div>
    );
}

export default Home;
