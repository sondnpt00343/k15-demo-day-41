import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation, useMeQuery } from "@/services/auth";
import loginSchema from "@/schemas/loginSchema";

function Login2() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const { isSuccess } = useMeQuery();
    const [login, response] = useLoginMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate("/");
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        if (response.isSuccess) {
            const { access_token } = response.data;
            localStorage.setItem("accessToken", access_token);

            navigate("/");
        }
    }, [response, navigate]);

    const handleLogin = (credentials) => {
        login(credentials);
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(handleLogin)}>
                <input {...register("email")} />
                {errors.email && (
                    <div className="error">{errors.email.message}</div>
                )}
                <br />
                <input type="password" {...register("password")} />
                {errors.password && (
                    <div className="error">{errors.password.message}</div>
                )}
                <button>Login</button>
            </form>
        </div>
    );
}

export default Login2;
