import Axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import * as Qs from 'qs';

// Create the axios instance
export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'repeat' }),
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Handle unauthorized, e.g., redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

/**
 * Axios client implementation for Orval-generated API clients
 */
export const orvalClient = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> & { cancel: () => void } => {
  const source = Axios.CancelToken.source();
  const promise = axiosInstance<T>({
    ...config,
    ...options,
    cancelToken: source.token,
  });

  const promiseWithCancel = promise as Promise<T> & { cancel: () => void };
  promiseWithCancel.cancel = () => {
    source.cancel('Request was cancelled');
  };

  return promiseWithCancel;
};

export type HttpError<T = unknown> = AxiosError<T>;
export type RequestBody<T = unknown> = T;
