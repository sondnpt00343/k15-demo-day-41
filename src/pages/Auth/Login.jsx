import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useLoginMutation, useMeQuery } from "@/services/auth";
import useFormValues from "@/hooks/useFormValues";

function Login() {
    const navigate = useNavigate();
    const [formValues, setFieldValue] = useFormValues({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (formValues.email && errors.email) {
            setErrors({
                ...errors,
                email: "",
            });
        }
        if (formValues.password && errors.password) {
            setErrors({
                ...errors,
                password: "",
            });
        }
    }, [errors, formValues]);

    const { isSuccess } = useMeQuery();
    const [login, response] = useLoginMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate("/");
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        if (response.isSuccess) {
            const { access_token, refresh_token } = response.data;
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);

            navigate("/");
        }
    }, [response, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();

        // Validation logic...

        const credentials = {
            email: formValues.email,
            password: formValues.password,
        };

        login(credentials);
    };

    const validate = (e) => {
        const value = formValues[e.target.name];
        if (!value) {
            setErrors({
                ...errors,
                [e.target.name]: "Vui lòng nhập trường này",
            });
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="email"
                    value={formValues.email}
                    placeholder="Enter email..."
                    onChange={setFieldValue}
                    onBlur={validate}
                />
                {errors.email && <p>{errors.email}</p>}
                <br />
                <input
                    type="password"
                    name="password"
                    value={formValues.password}
                    placeholder="Enter password..."
                    onChange={setFieldValue}
                    onBlur={validate}
                />
                {errors.password && <p>{errors.password}</p>}
                <button>Login</button>
            </form>
        </div>
    );
}

export default Login;
