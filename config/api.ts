// config/api.ts
import { Platform } from "react-native";
import Constants from "expo-constants";

const normalizeBaseUrl = (value?: string | null) => {
    if (!value) return null;
    return value.replace(/\/+$/, "");
};

const resolveDevHost = (): string | null => {
    const hostUri =
        Constants.expoConfig?.hostUri ??
        (Constants as any).manifest2?.extra?.expoClient?.hostUri ??
        (Constants as any).manifest?.hostUri ??
        null;

    if (!hostUri) return null;
    const host = hostUri.split(":")[0];
    return host || null;
};

const ENV_BASE_URL = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
const DEV_HOST = resolveDevHost();
const isPhysicalDevice = Constants.isDevice === true;

const getDefaultMobileHost = () => {
    if (Platform.OS === "android") {
        return isPhysicalDevice ? (DEV_HOST || "172.25.172.62") : "10.0.2.2";
    }

    if (Platform.OS === "ios") {
        return isPhysicalDevice ? (DEV_HOST || "172.25.172.62") : "localhost";
    }

    return "localhost";
};

export const API_BASE_URL =
    ENV_BASE_URL ??
    (Platform.OS === "web"
        ? "http://localhost:15080"
        : `http://${getDefaultMobileHost()}:15080`);

export const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === "true";

export const API_ROUTES = {
    login: `${API_BASE_URL}/api/auth/client`,
    clients: `${API_BASE_URL}/api/clients`,
    products: `${API_BASE_URL}/api/products`,
};
