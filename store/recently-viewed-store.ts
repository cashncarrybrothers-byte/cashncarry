'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/woocommerce';

interface RecentlyViewedState {
    products: Product[];
    addProduct: (product: Product) => void;
    clearAll: () => void;
    getProducts: () => Product[];
}

const MAX_RECENTLY_VIEWED = 10;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        (set, get) => ({
            products: [],

            addProduct: (product: Product) => {
                set((state) => {
                    // Remove the product if it already exists
                    const filtered = state.products.filter((p) => p.id !== product.id);

                    // Add the product to the beginning
                    const updated = [product, ...filtered];

                    // Keep only the last MAX_RECENTLY_VIEWED products
                    return {
                        products: updated.slice(0, MAX_RECENTLY_VIEWED),
                    };
                });
            },

            clearAll: () => {
                set({ products: [] });
            },

            getProducts: () => {
                return get().products;
            },
        }),
        {
            name: 'recently-viewed-storage',
            // Only persist essential product data to avoid storage bloat
            partialize: (state) => ({
                products: state.products.map((p) => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: p.price,
                    regular_price: p.regular_price,
                    sale_price: p.sale_price,
                    on_sale: p.on_sale,
                    stock_status: p.stock_status,
                    images: p.images?.slice(0, 1) || [], // Only keep first image
                    categories: p.categories?.slice(0, 1) || [], // Only keep first category
                })),
            }),
        }
    )
);
