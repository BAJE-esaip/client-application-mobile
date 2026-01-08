import React from 'react';
import {
    TouchableOpacity,
    Text,
    ViewStyle,
    TextStyle, // Importer TextStyle pour le style du texte
    StyleSheet // Importer StyleSheet pour les styles par défaut
} from 'react-native';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    // Renommons 'style' en 'buttonStyle' pour plus de clarté
    buttonStyle?: ViewStyle;
    // Ajouter une prop pour styliser le texte
    textStyle?: TextStyle;
    disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
                                                                title,
                                                                onPress,
                                                                disabled,
                                                                buttonStyle,
                                                                textStyle
                                                            }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            // Appliquer le style du bouton ici, en combinant un style par défaut
            // avec le style personnalisé.
            style={[styles.defaultButton, buttonStyle, disabled && styles.disabledButton]}
        >
            <Text style={[styles.defaultText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

// Styles par défaut et pour l'état désactivé
const styles = StyleSheet.create({
    defaultButton: {
        // Base pour tous les boutons
        backgroundColor: '#3B5998', // Bleu foncé par défaut
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center', // Centrer le texte horizontalement
        justifyContent: 'center',
    },
    defaultText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.6, // Assombrir le bouton si désactivé
    }
});