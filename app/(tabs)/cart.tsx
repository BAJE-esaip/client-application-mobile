import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/contexts/CartContext';

export default function CartScreen() {
    const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

    // --- ÉTATS POUR LE PAIEMENT ---
    const [checkoutVisible, setCheckoutVisible] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    const handleRemoveItem = (productId: number, productName: string) => {
        Alert.alert(
            'Retirer du panier',
            `Voulez-vous retirer "${productName}" du panier ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Retirer',
                    style: 'destructive',
                    onPress: () => removeFromCart(productId),
                },
            ]
        );
    };

    const handleClearCart = () => {
        Alert.alert(
            'Vider le panier',
            'Voulez-vous vraiment vider tout le panier ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Vider',
                    style: 'destructive',
                    onPress: clearCart,
                },
            ]
        );
    };

    // --- LOGIQUE DE PAIEMENT & HISTORIQUE ---
    const handleCheckout = async () => {
        setCheckoutVisible(true);
        setIsPaying(true);

        // Simulation du délai de paiement (2 secondes)
        setTimeout(async () => {
            setIsPaying(false);
            setIsPaid(true);

            // Création de l'objet commande
            const order = {
                id: Date.now(),
                date: new Date().toISOString(),
                total: getTotalPrice(),
                items: cart,
            };

            try {
                // Sauvegarde dans l'historique local
                const history = await AsyncStorage.getItem('orderHistory');
                const parsed = history ? JSON.parse(history) : [];
                parsed.unshift(order); // Ajoute au début de la liste

                await AsyncStorage.setItem('orderHistory', JSON.stringify(parsed));
            } catch (error) {
                console.error("Erreur lors de la sauvegarde de l'historique:", error);
            }
        }, 2000);
    };

    const handleClosePayment = () => {
        setCheckoutVisible(false);
        setIsPaid(false);
        clearCart(); // On vide le panier seulement après confirmation
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemHeader}>
                <View style={styles.itemIcon}>
                    <Text style={styles.itemIconText}>
                        {item.product.category?.weighable ? '⚖️' : '📦'}
                    </Text>
                </View>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.product.label}</Text>
                    {item.product.category && (
                        <Text style={styles.itemCategory}>{item.product.category.label}</Text>
                    )}
                    <Text style={styles.itemWeight}>
                        {(item.product.weight * 1000).toFixed(0)} g · {item.unit_price_at_sale.toFixed(2)} €/kg
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleRemoveItem(item.product.product_id, item.product.label)}
                    style={styles.removeButton}
                >
                    <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.itemFooter}>
                <View style={styles.quantityControls}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product.product_id, item.quantity - 1)}
                    >
                        <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product.product_id, item.quantity + 1)}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>
                    {(item.unit_price_at_sale * item.product.weight * item.quantity).toFixed(2)} €
                </Text>
            </View>
        </View>
    );

    if (cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🛒</Text>
                <Text style={styles.emptyTitle}>Votre panier est vide</Text>
                <Text style={styles.emptySubtitle}>
                    Scannez des produits pour les ajouter à votre panier
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mon Panier</Text>
                <TouchableOpacity onPress={handleClearCart}>
                    <Text style={styles.clearButton}>Vider</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.product.product_id.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <View>
                        <Text style={styles.totalLabel}>Total ({getTotalItems()} articles)</Text>
                        <Text style={styles.totalAmount}>{getTotalPrice().toFixed(2)} € TTC</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <Text style={styles.checkoutButtonText}>Commander</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- MODAL DE PAIEMENT --- */}
            <Modal visible={checkoutVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {isPaying ? (
                            <>
                                <ActivityIndicator size="large" color="#4338CA" />
                                <Text style={styles.modalText}>Paiement en cours...</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.successIcon}>✅</Text>
                                <Text style={styles.modalTitle}>Payé !</Text>
                                <Text style={styles.modalText}>
                                    Merci pour votre commande 🎉
                                </Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handleClosePayment}
                                >
                                    <Text style={styles.modalButtonText}>OK</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    clearButton: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
    listContainer: { padding: 16 },
    cartItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
    },
    itemHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    itemIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemIconText: { fontSize: 24 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    itemCategory: { fontSize: 12, color: '#2E7D32', marginBottom: 4 },
    itemWeight: { fontSize: 12, color: '#666' },
    removeButton: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
    removeButtonText: { fontSize: 20, color: '#999' },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 6,
    },
    quantityButtonText: { fontSize: 18, fontWeight: '600', color: '#4338CA' },
    quantityText: { fontSize: 16, fontWeight: '600', marginHorizontal: 16, textAlign: 'center' },
    itemPrice: { fontSize: 18, fontWeight: 'bold', color: '#4338CA' },
    footer: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
    totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    checkoutButton: { backgroundColor: '#4338CA', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 10 },
    checkoutButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyIcon: { fontSize: 80, marginBottom: 20 },
    emptyTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    emptySubtitle: { fontSize: 16, color: '#666', textAlign: 'center' },

    // --- STYLES MODAL ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 16,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    modalText: { fontSize: 16, color: '#555', marginVertical: 12, textAlign: 'center' },
    successIcon: { fontSize: 64, marginBottom: 12 },
    modalButton: {
        marginTop: 20,
        backgroundColor: '#4338CA',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 10,
    },
    modalButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});