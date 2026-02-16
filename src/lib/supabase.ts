import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string | null;
    image_url: string | null;
    in_stock: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductInsert {
    name: string;
    description?: string | null;
    price: number;
    category?: string | null;
    image_url?: string | null;
    in_stock?: boolean;
}

export interface ProductUpdate {
    name?: string;
    description?: string | null;
    price?: number;
    category?: string | null;
    image_url?: string | null;
    in_stock?: boolean;
    updated_at?: string;
}

// Cart types
export interface CartSession {
    id: string;
    session_id: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: string;
    cart_session_id: string;
    product_id: string;
    quantity: number;
    price_snapshot: number;
    created_at: string;
    updated_at: string;
    product?: Product;
}

export interface CartItemInsert {
    cart_session_id: string;
    product_id: string;
    quantity: number;
    price_snapshot: number;
}

// Order types (to be used in later phases)
export type OrderStatus =
    | 'pending_payment'
    | 'payment_processing'
    | 'payment_review'
    | 'payment_confirmed'
    | 'preparing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export type PaymentMethod = 'mercadopago' | 'bank_transfer';

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded';
