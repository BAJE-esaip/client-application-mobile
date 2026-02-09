// app/(tabs)/scan.tsx
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { useProductInfo } from '@/hooks/useProductInfo';
import { useCart } from '@/contexts/CartContext';

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const {
        productInfo,
        isLoading,
        error,
        fetchProductInfo,
        resetProduct,
        calculateTotalPrice,
        calculatePriceWithVAT
    } = useProductInfo();

    // 🛒 Utilisation du contexte panier
    const { addToCart } = useCart();

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

    // Fonction appelée quand un code-barres est détecté
    const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;

        setScanned(true);

        console.log('📦 Code-barres scanné !');
        console.log('Type:', type);
        console.log('Données:', data);

        await fetchProductInfo(data);
    };

    // Fonction pour continuer le scan
    const handleContinue = () => {
        console.log('👀 Continuer - Consultation des informations');
        setScanned(false);
        resetProduct();
    };

    // Fonction pour ajouter au panier
    const handleAddToCart = async () => {
        if (!productInfo) return;

        const priceTTC = calculatePriceWithVAT(productInfo);

        console.log('🛒 Ajout au panier:', {
            product_id: productInfo.product_id,
            label: productInfo.label,
            quantity: 1,
            unit_price_at_sale: priceTTC,
            weight: productInfo.weight,
        });

        // Ajouter au panier via le contexte
        await addToCart(productInfo, priceTTC);

        // Fermer la modal et réinitialiser
        setScanned(false);
        resetProduct();
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                barcodeScannerSettings={{
                    barcodeTypes: ['code128', 'ean13', 'ean8'],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

            {/* Zone de scan visuelle */}
            <View style={styles.scanArea}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {/* Modal avec les informations du produit */}
            <Modal
                visible={scanned}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#4338CA" />
                                <Text style={styles.loadingText}>
                                    Recherche du produit...
                                </Text>
                            </View>
                        ) : error || !productInfo ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorIcon}>❌</Text>
                                <Text style={styles.errorTitle}>Produit non trouvé</Text>
                                <Text style={styles.errorMessage}>
                                    {error || "Ce code-barres n'est pas reconnu"}
                                </Text>
                                <TouchableOpacity
                                    style={[styles.button, styles.continueButton]}
                                    onPress={handleContinue}
                                >
                                    <Text style={[styles.buttonText, styles.continueButtonText]}>
                                        Réessayer
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <View style={styles.imagePreview}>
                                    <View style={styles.imagePlaceholder}>
                                        <Text style={styles.imagePlaceholderText}>
                                            {productInfo.category?.weighable ? '⚖️' : '📦'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.productInfo}>
                                    <Text style={styles.title}>Article scanné</Text>
                                    <Text style={styles.productName}>{productInfo.label}</Text>

                                    {productInfo.category && (
                                        <View style={styles.categoryBadge}>
                                            <Text style={styles.categoryText}>
                                                {productInfo.category.label}
                                            </Text>
                                        </View>
                                    )}

                                    <View style={styles.priceSection}>
                                        <Text style={styles.productPriceTTC}>
                                            Prix : {calculatePriceWithVAT(productInfo).toFixed(2)} € / kg
                                        </Text>
                                    </View>

                                    <View style={styles.weightSection}>
                                        <Text style={styles.weightLabel}>
                                            Poids : {(productInfo.weight * 1000).toFixed(0)} g
                                        </Text>
                                        <Text style={styles.totalPrice}>
                                            Total : {(calculateTotalPrice(productInfo) * (1 + (productInfo.vat_rate?.rate ?? 0) / 100)).toFixed(2)} € TTC
                                        </Text>
                                    </View>

                                    {productInfo.inventory !== undefined && (
                                        <View style={styles.inventorySection}>
                                            <Text style={styles.inventoryText}>
                                                Stock disponible : {productInfo.inventory} unités
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.addButton]}
                                        onPress={handleAddToCart}
                                    >
                                        <Text style={styles.buttonText}>Ajouter au panier</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button, styles.continueButton]}
                                        onPress={handleContinue}
                                    >
                                        <Text style={[styles.buttonText, styles.continueButtonText]}>
                                            Continuer
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    link: {
        marginTop: 10,
        color: 'blue',
        fontSize: 16,
    },
    scanArea: {
        position: 'absolute',
        top: '30%',
        left: '10%',
        right: '10%',
        height: 250,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#fff',
        borderWidth: 3,
    },
    topLeft: {
        top: -2,
        left: -2,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: -2,
        right: -2,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: -2,
        left: -2,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: -2,
        right: -2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorIcon: {
        fontSize: 60,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    imagePreview: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#90EE90',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    imagePlaceholderText: {
        fontSize: 50,
    },
    productInfo: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    categoryBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'center',
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '600',
    },
    priceSection: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    productPriceTTC: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    weightSection: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    weightLabel: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4338CA',
    },
    inventorySection: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    inventoryText: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
    },
    buttonContainer: {
        gap: 10,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#4338CA',
    },
    continueButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#4338CA',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    continueButtonText: {
        color: '#4338CA',
    },
});