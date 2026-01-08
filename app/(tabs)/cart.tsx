import { View, Text } from 'react-native';

export default function CartScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>🛒 Panier</Text>
            <Text>Vos articles apparaîtront ici</Text>
        </View>
    );
}
