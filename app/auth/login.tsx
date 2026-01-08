import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
// 💡 Importer le LinearGradient
import { LinearGradient } from 'expo-linear-gradient';

import { Input } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { useLogin } from '@/hooks/useLogin';

export default function LoginScreen() {
    // ... (Logique useLogin inchangée)
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        login,
    } = useLogin();


    // Définissons des couleurs pour le dégradé qui rappellent votre maquette :
    const gradientColors = ['#6A9AFE', '#2B69D8']; // Du bleu clair au bleu plus foncé

    return (
        // 💡 Remplacer <View style={styles.container}> par LinearGradient
        <LinearGradient
            // 1. Définir les couleurs du dégradé
            colors={gradientColors}
            // 2. Définir le point de départ (en haut) et d'arrivée (en bas) du dégradé
            start={{ x: 0, y: 0 }} // x:0 y:0 est en haut à gauche
            end={{ x: 0, y: 1 }}   // x:0 y:1 est en bas
            style={styles.container}
        >
            <View style={styles.loginForm}>
                {/* ... (Vos Inputs) */}
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
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#555"
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <PrimaryButton
                    title={isLoading ? "Connexion..." : "Se connecter"}
                    onPress={login}
                    disabled={isLoading}
                    buttonStyle={styles.loginButton}
                />
            </View>

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => { /* Logique Mots de passe oubliés */ }}>
                    <Text style={styles.linkText}>Mots de passe oubliés ?</Text>
                </TouchableOpacity>
                <Text style={styles.linkTextSeparator}> / </Text>
                <TouchableOpacity onPress={() => router.navigate("auth/signup")}>
                    <Text style={styles.linkText}>Créer un compte</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // ❌ Le LinearGradient gère le fond, nous retirons backgroundColor: '#4A90E2',
        paddingHorizontal: 25,
        justifyContent: 'center',
    },
    // ... (Reste des styles inchangés)
    loginForm: {
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
    loginButton: {
        backgroundColor: '#3B5998',
        marginTop: 20,
        // Assurez-vous que ce style est appliqué au bouton lui-même
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    linkText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
    linkTextSeparator: {
        color: 'white',
        fontSize: 16,
        marginHorizontal: 5,
        fontWeight: '600',
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    }
});