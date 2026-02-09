import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const loadHistory = async () => {
            const data = await AsyncStorage.getItem('orderHistory');
            setOrders(data ? JSON.parse(data) : []);
        };

        loadHistory();
    }, []);

    if (orders.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyIcon}>🧾</Text>
                <Text>Aucun achat pour le moment</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historique des achats</Text>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                        <Text style={styles.orderDate}>
                            {new Date(item.date).toLocaleDateString()}
                        </Text>
                        <Text style={styles.orderTotal}>
                            {item.total.toFixed(2)} €
                        </Text>
                        <Text style={styles.orderCount}>
                            {item.items.length} article(s)
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    orderItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    orderCount: {
        fontSize: 12,
        color: '#999',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 12,
    },
});
