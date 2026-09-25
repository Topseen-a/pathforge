import axios, { type AxiosInstance } from "axios";
import type { ApiError } from "./types";

export const API_BASE_URL: string =
  (import.meta as unknown as { env: Record<string, string> }).env
    ?.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const TOKEN_KEY = "pathforge_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized: (() => void) | null = null;
export function registerUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      setToken(null);
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export function extractError(err: unknown): ApiError {
  const fallback: ApiError = { message: "Something went wrong. Please try again." };
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined;
    if (data?.message) return data;
    if (err.message) return { message: err.message };
  }
  return fallback;
}
