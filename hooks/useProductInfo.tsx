// hooks/useProductInfo.ts
import { useState } from "react";
import { API_ROUTES } from "@/config/api";

export type ProductInfo = {
    product_id: number;
    label: string;
    unit_price_untaxed: number;
    weight: number;
    barcode: string;
    inventory: number;
    category?: {
        category_id: number;
        label: string;
        weighable: boolean;
    };
    vat_rate?: {
        vat_id: number;
        rate: number;
    };
};

export const useProductInfo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

    /**
     * Récupère les informations d'un produit à partir de son code-barres
     * @param barcode Le code-barres scanné
     */
    const fetchProductInfo = async (barcode: string): Promise<ProductInfo | null> => {
        setError(null);
        setIsLoading(true);

        try {
            console.log("🔍 Recherche du produit :", barcode);

            // 🚧 MODE MOCK - À REMPLACER PAR L'API RÉELLE
            // Pour le moment, on retourne des données mockées
            const mockProduct = await getMockProduct(barcode);

            if (mockProduct) {
                setProductInfo(mockProduct);
                console.log("✅ Produit trouvé :", mockProduct);
                return mockProduct;
            }

            /*
            // 🔥 CODE À ACTIVER QUAND L'API SERA PRÊTE :

            const response = await fetch(`${API_ROUTES.products}/${barcode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    // Si nécessaire, ajouter un token d'authentification :
                    // "Authorization": `Bearer ${token}`,
                },
            });

            console.log("📡 Status HTTP :", response.status);

            const text = await response.text();
            console.log("📡 Réponse brute :", text);

            if (!text) {
                throw new Error("Réponse serveur vide");
            }

            let result: ProductInfo;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.log("❌ Réponse brute serveur :", text);
                throw new Error("Réponse serveur invalide (pas du JSON)");
            }

            if (!response.ok) {
                throw new Error("Produit non trouvé");
            }

            setProductInfo(result);
            console.log("✅ Produit trouvé :", result);
            return result;
            */

        } catch (err: any) {
            console.log("❌ Erreur lors de la récupération du produit :", err.message);
            setError(err.message);
            setProductInfo(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Calcule le prix total en fonction du poids et du prix unitaire
     */
    const calculateTotalPrice = (product: ProductInfo): number => {
        return product.unit_price_untaxed * product.weight;
    };

    /**
     * Calcule le prix TTC (avec TVA)
     */
    const calculatePriceWithVAT = (product: ProductInfo): number => {
        const vatRate = product.vat_rate?.rate || 0;
        return product.unit_price_untaxed * (1 + vatRate / 100);
    };

    /**
     * Réinitialise l'état du produit
     */
    const resetProduct = () => {
        setProductInfo(null);
        setError(null);
    };

    return {
        productInfo,
        isLoading,
        error,
        fetchProductInfo,
        resetProduct,
        calculateTotalPrice,
        calculatePriceWithVAT,
    };
};

/**
 * 🚧 FONCTION TEMPORAIRE - Simule une API
 * À SUPPRIMER quand l'API sera prête
 */
const getMockProduct = async (barcode: string): Promise<ProductInfo | null> => {
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Base de données mockée basée sur votre structure réelle
    const mockDatabase: Record<string, ProductInfo> = {
        "3560070010234": {
            product_id: 1,
            label: "Tomates Grappe Bio",
            unit_price_untaxed: 3.50,
            weight: 0.250,
            barcode: "3560070010234",
            inventory: 45,
            category: {
                category_id: 1,
                label: "Fruits & Légumes",
                weighable: true,
            },
            vat_rate: {
                vat_id: 1,
                rate: 5.5,
            },
        },
        "3760123456789": {
            product_id: 2,
            label: "Pommes Golden",
            unit_price_untaxed: 2.99,
            weight: 0.500,
            barcode: "3760123456789",
            inventory: 120,
            category: {
                category_id: 1,
                label: "Fruits & Légumes",
                weighable: true,
            },
            vat_rate: {
                vat_id: 1,
                rate: 5.5,
            },
        },
        "3250392001234": {
            product_id: 3,
            label: "Carottes Bio",
            unit_price_untaxed: 4.20,
            weight: 0.750,
            barcode: "3250392001234",
            inventory: 80,
            category: {
                category_id: 1,
                label: "Fruits & Légumes",
                weighable: true,
            },
            vat_rate: {
                vat_id: 1,
                rate: 5.5,
            },
        },
        "8712345678901": {
            product_id: 4,
            label: "Pain de Campagne",
            unit_price_untaxed: 2.50,
            weight: 0.400,
            barcode: "8712345678901",
            inventory: 30,
            category: {
                category_id: 2,
                label: "Boulangerie",
                weighable: false,
            },
            vat_rate: {
                vat_id: 1,
                rate: 5.5,
            },
        },
        "4567890123456": {
            product_id: 5,
            label: "Fromage Comté AOP",
            unit_price_untaxed: 18.90,
            weight: 0.200,
            barcode: "4567890123456",
            inventory: 25,
            category: {
                category_id: 3,
                label: "Crémerie",
                weighable: true,
            },
            vat_rate: {
                vat_id: 1,
                rate: 5.5,
            },
        },
    };

    const product = mockDatabase[barcode];

    if (!product) {
        console.log("❌ Produit non trouvé dans la base mock");
        return null;
    }

    return product;
};