import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("resellerToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      const refresh = localStorage.getItem("resellerRefreshToken");
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/reseller/auth/refresh`,
            { refresh_token: refresh }
          );
          localStorage.setItem("resellerToken", data.token);
          localStorage.setItem("resellerRefreshToken", data.refresh_token);
          err.config.headers.Authorization = `Bearer ${data.token}`;
          return axios(err.config);
        } catch {
          localStorage.removeItem("resellerToken");
          localStorage.removeItem("resellerRefreshToken");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("resellerToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
