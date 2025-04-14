import { clsx, type ClassValue } from "clsx"
import axios from "axios"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function truncate(str: string, length: number, placeholder: string = "...") {
  return str.length > length ? str.substring(0, length) + placeholder : str;
}

export function getExtension(fileName: string) {
  return fileName.split(".").pop();
}

export function formatSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  
  return `${formattedSize} ${sizes[i]}`;
}
