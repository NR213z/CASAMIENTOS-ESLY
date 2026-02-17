import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Product, CartItem } from '@/lib/supabase';

const CART_TOKEN_KEY = 'cart_session_token';

interface CartContextType {
    items: CartItem[];
    itemCount: number;
    total: number;
    addItem: (product: Product, quantity?: number) => Promise<void>;
    removeItem: (cartItemId: string) => Promise<void>;
    updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    sessionToken: string | null;
    loading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};

const getOrCreateToken = (): string => {
    let token = localStorage.getItem(CART_TOKEN_KEY);
    if (!token) {
        token = crypto.randomUUID();
        localStorage.setItem(CART_TOKEN_KEY, token);
    }
    return token;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getOrCreateToken();
        setSessionToken(token);
        fetchCart(token);
    }, []);

    const fetchCart = async (token: string) => {
        setLoading(true);
        try {
            // Get or create cart session
            let { data: session } = await supabase
                .from('cart_sessions')
                .select('id')
                .eq('session_token', token)
                .single();

            if (!session) {
                const { data: newSession, error } = await supabase
                    .from('cart_sessions')
                    .insert({ session_token: token })
                    .select('id')
                    .single();
                if (error) throw error;
                session = newSession;
            }

            setSessionId(session.id);

            const { data: cartItems, error: itemsError } = await supabase
                .from('cart_items')
                .select('*, product:products(*)')
                .eq('cart_session_id', session.id);

            if (itemsError) throw itemsError;
            setItems(cartItems || []);
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (product: Product, quantity = 1) => {
        if (!sessionId) return;

        // Check if already in cart
        const existing = items.find(i => i.product_id === product.id);
        if (existing) {
            await updateQuantity(existing.id, existing.quantity + quantity);
            return;
        }

        const { data, error } = await supabase
            .from('cart_items')
            .insert({
                cart_session_id: sessionId,
                product_id: product.id,
                quantity,
                unit_price: product.price,
            })
            .select('*, product:products(*)')
            .single();

        if (error) { console.error(error); return; }
        setItems(prev => [...prev, data]);
    };

    const removeItem = async (cartItemId: string) => {
        const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
        if (error) { console.error(error); return; }
        setItems(prev => prev.filter(i => i.id !== cartItemId));
    };

    const updateQuantity = async (cartItemId: string, quantity: number) => {
        if (quantity <= 0) { await removeItem(cartItemId); return; }

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', cartItemId);

        if (error) { console.error(error); return; }
        setItems(prev => prev.map(i => i.id === cartItemId ? { ...i, quantity } : i));
    };

    const clearCart = async () => {
        if (!sessionId) return;
        await supabase.from('cart_items').delete().eq('cart_session_id', sessionId);
        setItems([]);
    };

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart, sessionToken, loading }}>
            {children}
        </CartContext.Provider>
    );
};
