import { Platform } from "react-native";

export const API_BASE_URL =
    Platform.OS === "web"
        ? "http://localhost"
        // : "http://10.0.2.2";
        : "http://192.168.1.137";

export const API_ROUTES = {
    login: `${API_BASE_URL}/api/auth`,
    clients: `${API_BASE_URL}/api/clients`,
};
