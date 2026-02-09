// components/CartBadge.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from '@/contexts/CartContext';

export default function CartBadge() {
    const { getTotalItems } = useCart();
    const itemCount = getTotalItems();

    if (itemCount === 0) {
        return null;
    }

    return (
        <View style={styles.badge}>
            <Text style={styles.badgeText}>
                {itemCount > 99 ? '99+' : itemCount}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -6,
        right: -10,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    badgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
    },
});