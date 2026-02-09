// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from '@/contexts/CartContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <CartProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </CartProvider>
        </AuthProvider>
    );
}