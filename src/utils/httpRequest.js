import axios from "axios";

const httpRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
});

httpRequest.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

axios.interceptors.response.use((response) => {
    return response.data;
});

let isRefreshing = false;

let queueJobs = [];

async function sendRefreshToken(config, refreshToken) {
    isRefreshing = true;

    const response = await axios.post(`${config.baseURL}/auth/refresh-token`, {
        refresh_token: refreshToken,
    });

    const { access_token, refresh_token } = response.data;

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
}

httpRequest.interceptors.response.use(
    (response) => response.data,

    async (error) => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (error.status === 401 && refreshToken) {
            const original = error.config;

            try {
                if (!isRefreshing) {
                    await sendRefreshToken(original, refreshToken);

                    queueJobs.forEach((job) => job.resolve());
                } else {
                    await new Promise((resolve, reject) => {
                        queueJobs.push({ resolve, reject });
                    });
                }

                return await httpRequest.request(original);
            } catch (error) {
                queueJobs.forEach((job, index) => {
                    queueJobs.splice(index, 1);
                    job.reject();
                });

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default httpRequest;
