import axios from "axios";
import { store } from "@/store/store";
import { setUser, clearCredentials } from "@/store/slice/authSlice/authSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 140000,
  withCredentials: true,
});

AxiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

AxiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue requests that come in while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return AxiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true; // Prevent infinite retry loops
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh-token`, // Fix: include full URL with baseURL
          {},
          { withCredentials: true },
        );

        const newToken = res.data.accessToken;

        store.dispatch(
          setUser({
            accessToken: newToken,
            user: store.getState().auth.user!,
          }),
        );

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken); //  Resolve all queued requests

        return AxiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null); //  Reject all queued requests
        store.dispatch(clearCredentials());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default AxiosInstance;
