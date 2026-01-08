// hooks/useLogin.ts
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { API_ROUTES } from "@/config/api";

type LoginResponse = {
    token: string;
    user: any;
    message?: string;
};

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
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            // 🔥 IMPORTANT : lire en texte d'abord
            const text = await response.text();

            if (!text) {
                throw new Error("Réponse serveur vide");
            }

            let result: LoginResponse;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.log("❌ Réponse brute serveur :", text);
                throw new Error("Réponse serveur invalide (pas du JSON)");
            }

            if (!response.ok) {
                throw new Error(result.message || "Identifiants incorrects");
            }

            console.log("✅ Token :", result.token);
            console.log("✅ User :", result.user);

            // ✅ LOGIN OK
            setIsLogged(true);
            router.replace("(tabs)");

        } catch (err: any) {
            console.log("❌ Erreur login :", err.message);
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
