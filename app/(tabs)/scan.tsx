import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();

    // Permission pas encore chargée
    if (!permission) {
        return <View />;
    }

    // Permission refusée
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>Accès à la caméra refusé</Text>
                <Text onPress={requestPermission} style={styles.link}>
                    Autoriser la caméra
                </Text>
            </View>
        );
    }

    // Aperçu caméra
    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    link: {
        marginTop: 10,
        color: 'blue',
    },
});
