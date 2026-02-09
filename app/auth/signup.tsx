import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import { API_ROUTES } from "@/config/api";
export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [plainPassword, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const signup = async () => {
        console.log("🟦 [SIGNUP] Début inscription");

        setError(null);

        if (!email || !plainPassword) {
            console.log("🟥 [SIGNUP] Champs manquants");
            setError("Veuillez remplir tous les champs.");
            return;
        }

        console.log("🟨 [SIGNUP] Données envoyées :", {
            email,
            password: "******",
        });

        setLoading(true);

        try {
            console.log("🟦 [SIGNUP] Appel API :", API_ROUTES.clients);

            const response = await fetch(API_ROUTES.clients, {
                method: "POST",
                headers: {
                    "Content-Type": "application/ld+json",
                    "Accept": "application/ld+json",
                },
                body: JSON.stringify({
                    email,
                    password: plainPassword,
                }),
            });

            console.log("🟩 [SIGNUP] Réponse reçue, status :", response.status);

            const text = await response.text();
            console.log("🟩 [SIGNUP] Réponse brute :", text);

            const result = text ? JSON.parse(text) : null;

            if (!response.ok) {
                console.log("🟥 [SIGNUP] Erreur API :", result);
                throw new Error(
                    result?.["hydra:description"] ||
                    result?.detail ||
                    "Impossible de créer le compte."
                );
            }

            console.log("✅ [SIGNUP] Compte créé avec succès");
            console.log("➡️ [SIGNUP] Redirection vers auth/login");

            router.replace("/auth/login");

        } catch (e: any) {
            console.log("🔥 [SIGNUP] ERREUR FATALE :", e);
            setError(e.message || "Erreur réseau");
        } finally {
            setLoading(false);
            console.log("🟦 [SIGNUP] Fin inscription");
        }
    };



    const gradientColors = ['#6A9AFE', '#2B69D8'];

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.fullScreen}
        >
            <SafeAreaView style={styles.fullScreen}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.fullScreen}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Créer un compte</Text>
                            <Input
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={styles.input}
                                placeholderTextColor="#555"
                            />

                            <Input
                                placeholder="Mot de passe"
                                value={plainPassword}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                                placeholderTextColor="#555"
                            />

                            {error && <Text style={styles.errorText}>{error}</Text>}

                            <PrimaryButton
                                title={loading ? "Création..." : "Créer un compte"}
                                onPress={signup}
                                disabled={loading}
                                buttonStyle={styles.signupButton}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => router.navigate("auth/login")}
                            style={styles.loginLinkContainer}
                        >
                            <Text style={styles.loginLinkText}>Se connecter</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 50,
    },
    formContainer: {
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
    },
    signupButton: {
        backgroundColor: '#3B5998',
        marginTop: 20,
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    loginLinkContainer: {
        marginTop: 30,
        alignSelf: 'center',
    },
    loginLinkText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});