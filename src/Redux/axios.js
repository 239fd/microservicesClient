import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8765",
});

const instance = axios.create({
    baseURL: "http://localhost:8765",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");
                const response = await axios.post("http://localhost:8765/auth-service/auth/refresh ", {
                    refreshToken: refreshToken,
                });
                const newAccessToken = response.data.data.accessToken;
                localStorage.setItem("jwtToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                console.error("Ошибка при обновлении токена", err);
                localStorage.removeItem("jwtToken");
                localStorage.removeItem("refresh");
                window.location.href = "";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export {instance, api};
