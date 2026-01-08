import { Tabs, Redirect } from "expo-router";
import { View } from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function TabsLayout() {
    const { isLogged } = useAuth();

    if (!isLogged) {
        return <Redirect href="/auth/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Accueil" }} />
            <Tabs.Screen name="scan" options={{ title: "Scanner" }} />
            <Tabs.Screen name="cart" options={{ title: "Panier" }} />
            <Tabs.Screen name="settings" options={{ title: "Paramètres" }} />
        </Tabs>
    );
}
