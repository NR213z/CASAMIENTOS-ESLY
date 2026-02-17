import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, Product, CartItem, CartItemInsert } from '@/lib/supabase';

interface CartContextType {
    cartSessionId: string;
    items: CartItem[];
    loading: boolean;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartSessionId, setCartSessionId] = useState<string>('');
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Initialize cart session on mount
    useEffect(() => {
        initializeCart();
    }, []);

    const initializeCart = async () => {
        try {
            // Get or create session ID from localStorage
            let sessionId = localStorage.getItem('cartSessionId');

            if (!sessionId) {
                // Generate new session ID
                sessionId = crypto.randomUUID();
                localStorage.setItem('cartSessionId', sessionId);

                // Create cart session in database
                const { error } = await supabase
                    .from('cart_sessions')
                    .insert({ session_id: sessionId });

                if (error) throw error;
            }

            setCartSessionId(sessionId);
            await fetchCart(sessionId);
        } catch (error) {
            console.error('Error initializing cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCart = async (sessionId: string) => {
        try {
            const { data, error } = await supabase
                .from('cart_items')
                .select(`
                    *,
                    product:products(*)
                `)
                .eq('cart_session_id', (
                    await supabase
                        .from('cart_sessions')
                        .select('id')
                        .eq('session_id', sessionId)
                        .single()
                ).data?.id || '');

            if (error) throw error;

            setItems(data || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const getCartSessionDbId = async (): Promise<string | null> => {
        const { data, error } = await supabase
            .from('cart_sessions')
            .select('id')
            .eq('session_id', cartSessionId)
            .single();

        if (error || !data) return null;
        return data.id;
    };

    const addToCart = async (productId: string, quantity: number = 1) => {
        try {
            const cartDbId = await getCartSessionDbId();
            if (!cartDbId) throw new Error('Cart session not found');

            // Get product details for price snapshot
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('price')
                .eq('id', productId)
                .single();

            if (productError || !product) throw new Error('Product not found');

            // Check if item already exists in cart
            const existingItem = items.find(item => item.product_id === productId);

            if (existingItem) {
                // Update quantity
                const { error } = await supabase
                    .from('cart_items')
                    .update({ quantity: existingItem.quantity + quantity })
                    .eq('id', existingItem.id);

                if (error) throw error;
            } else {
                // Add new item
                const cartItem: CartItemInsert = {
                    cart_session_id: cartDbId,
                    product_id: productId,
                    quantity,
                    price_snapshot: product.price
                };

                const { error } = await supabase
                    .from('cart_items')
                    .insert(cartItem);

                if (error) throw error;
            }

            // Refresh cart
            await fetchCart(cartSessionId);
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        try {
            const item = items.find(item => item.product_id === productId);
            if (!item) return;

            if (quantity <= 0) {
                await removeFromCart(productId);
                return;
            }

            const { error } = await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('id', item.id);

            if (error) throw error;

            await fetchCart(cartSessionId);
        } catch (error) {
            console.error('Error updating quantity:', error);
            throw error;
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            const item = items.find(item => item.product_id === productId);
            if (!item) return;

            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', item.id);

            if (error) throw error;

            await fetchCart(cartSessionId);
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            const cartDbId = await getCartSessionDbId();
            if (!cartDbId) return;

            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('cart_session_id', cartDbId);

            if (error) throw error;

            setItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + (item.price_snapshot * item.quantity), 0);
    };

    const value = {
        cartSessionId,
        items,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
