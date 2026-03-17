import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import notificationService from '@/shared/services/notification';
import i18n from "@/i18n";

let navigateFn: ((path: string) => void) | null = null;
let unauthorizedCallback: (() => void) | null = null;

// 1. Create Axios Instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10 seconds timeout,
  withCredentials: true
});

// 2. Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers["X-Csrf-Token"] = token;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as any;
    const backendMessage = data?.message;
    const errorMessage = backendMessage || i18n.t("apiService:error.unexpected_err");

    const isSilent = (error.config as any)?.silent === true;

    if (!isSilent) {
      switch (status) {
        case 401:
          if (unauthorizedCallback) {
            unauthorizedCallback();
          } else {
            localStorage.removeItem("token");
            if (navigateFn) navigateFn('/login');
          }
          notificationService.error(backendMessage || i18n.t("apiService:error.unauthorized"));
          break;

        case 403:
          notificationService.warning(backendMessage || i18n.t("apiService:error.forbidden"));
          break;

        case 404:
          notificationService.info(backendMessage || i18n.t("apiService:error.not_found"));
          break;

        case 500:
          notificationService.error(backendMessage || i18n.t("apiService:error.internal_server"));
          break;

        default:
          if (error.code === 'ERR_NETWORK') {
            notificationService.error(i18n.t("apiService:error.network"));
          } else {
            notificationService.error(errorMessage);
          }
      }
    }

    return Promise.reject(error);
  }
);

// 4. Export Methods
export const apiService = {
  get: <T = any>(url: string, config = {}) => apiClient.get<any, T>(url, config),

  post: <T = any>(url: string, data?: any, config = {}) => apiClient.post<any, T>(url, data, config),

  put: <T = any>(url: string, data?: any, config = {}) => apiClient.put<any, T>(url, data, config),

  delete: <T = any>(url: string, config = {}) => apiClient.delete<any, T>(url, config),

  patch: <T = any>(url: string, data?: any, config = {}) => apiClient.patch<any, T>(url, data, config),

  client: apiClient,

  setNavigate: (fn: (path: string) => void) => {
    navigateFn = fn;
  },

  setUnauthorizedCallback: (fn: () => void) => {
    unauthorizedCallback = fn;
  }
};

export default apiService;
