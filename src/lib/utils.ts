import { clsx, type ClassValue } from "clsx"
import axios from "axios"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_WEBHDFS_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function truncate(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}
