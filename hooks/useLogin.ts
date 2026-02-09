import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { API_ROUTES } from "@/config/api";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setIsLogged } = useAuth();

    const login = async () => {
        setError(null);

        if (!email || !password) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(API_ROUTES.login, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            // ✅ SI 200 → LOGIN OK, MÊME SANS BODY
            if (response.ok) {
                setIsLogged(true);
                router.replace("(tabs)");
                return;
            }

            // ❌ Si pas OK, on tente de lire l’erreur
            const text = await response.text();
            throw new Error(text || "Identifiants incorrects");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        login,
    };
};
