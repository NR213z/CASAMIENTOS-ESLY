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

export interface CartSession {
    id: string;
    session_token: string;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: string;
    cart_session_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    created_at: string;
    product?: Product;
}

export interface Order {
    id: string;
    cart_session_id: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes: string | null;
    created_at: string;
    updated_at: string;
    order_items?: OrderItem[];
    payments?: Payment[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    created_at: string;
    product?: Product;
}

export interface Payment {
    id: string;
    order_id: string;
    amount: number;
    payment_method: string | null;
    receipt_url: string | null;
    status: 'pending' | 'verified' | 'rejected';
    notes: string | null;
    created_at: string;
    updated_at: string;
}
