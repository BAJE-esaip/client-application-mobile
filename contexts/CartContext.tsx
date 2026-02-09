// contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductInfo } from '@/hooks/useProductInfo';

export type CartItem = {
    product: ProductInfo;
    quantity: number;
    unit_price_at_sale: number; // Prix TTC au moment de l'ajout
    addedAt: string; // Date d'ajout
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: ProductInfo, priceTTC: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Charger le panier depuis AsyncStorage au démarrage
    useEffect(() => {
        loadCart();
    }, []);

    // Sauvegarder le panier dans AsyncStorage à chaque modification
    useEffect(() => {
        if (!isLoading) {
            saveCart();
        }
    }, [cart]);

    const loadCart = async () => {
        try {
            const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (cartData) {
                const parsedCart = JSON.parse(cartData);
                setCart(parsedCart);
                console.log('📦 Panier chargé :', parsedCart);
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement du panier :', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveCart = async () => {
        try {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            console.log('💾 Panier sauvegardé');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde du panier :', error);
        }
    };

    const addToCart = async (product: ProductInfo, priceTTC: number) => {
        setCart((prevCart) => {
            // Vérifier si le produit existe déjà dans le panier
            const existingItemIndex = prevCart.findIndex(
                (item) => item.product.product_id === product.product_id
            );

            if (existingItemIndex > -1) {
                // Le produit existe déjà, on augmente la quantité
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + 1,
                };
                console.log('✅ Quantité augmentée pour :', product.label);
                return updatedCart;
            } else {
                // Nouveau produit, on l'ajoute au panier
                const newItem: CartItem = {
                    product,
                    quantity: 1,
                    unit_price_at_sale: priceTTC,
                    addedAt: new Date().toISOString(),
                };
                console.log('✅ Produit ajouté au panier :', product.label);
                return [...prevCart, newItem];
            }
        });
    };

    const removeFromCart = async (productId: number) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter(
                (item) => item.product.product_id !== productId
            );
            console.log('🗑️ Produit retiré du panier');
            return updatedCart;
        });
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.product.product_id === productId
                    ? { ...item, quantity }
                    : item
            );
            console.log('🔄 Quantité mise à jour');
            return updatedCart;
        });
    };

    const clearCart = async () => {
        setCart([]);
        console.log('🗑️ Panier vidé');
    };

    const getTotalPrice = (): number => {
        return cart.reduce((total, item) => {
            return total + (item.unit_price_at_sale * item.product.weight * item.quantity);
        }, 0);
    };

    const getTotalItems = (): number => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalPrice,
                getTotalItems,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};