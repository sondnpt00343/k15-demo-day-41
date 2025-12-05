/* eslint-disable react/prop-types */
import { useMeQuery } from "@/services/auth";
import { Navigate, Outlet } from "react-router";

function PrivateRoute() {
    const { isError, isLoading } = useMeQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default PrivateRoute;
