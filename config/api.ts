// config/api.ts
import { Platform } from "react-native";

export const API_BASE_URL =
    Platform.OS === "web"
        ? "http://localhost:15080"
        : "http://172.25.172.62:15080";
        // : "http://172.20.10.14";

export const API_ROUTES = {
    login: `${API_BASE_URL}/api/auth/client`,
    clients: `${API_BASE_URL}/api/clients`,
    products: `${API_BASE_URL}/api/products`,
};