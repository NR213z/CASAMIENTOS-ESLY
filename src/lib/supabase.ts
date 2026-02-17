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
    stock_quantity: number;
    reserved_quantity: number;
    low_stock_threshold: number;
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

// Order interfaces
export interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    subtotal: number;
    tax: number;
    total: number;
    status: OrderStatus;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    customer_notes: string | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
    paid_at: string | null;
    cancelled_at: string | null;
}

export interface OrderInsert {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    subtotal: number;
    tax?: number;
    total: number;
    payment_method: PaymentMethod;
    customer_notes?: string | null;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    product_description: string | null;
    product_category: string | null;
    product_image_url: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
    created_at: string;
}

export interface OrderItemInsert {
    order_id: string;
    product_id: string;
    product_name: string;
    product_description: string | null;
    product_category: string | null;
    product_image_url: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface Payment {
    id: string;
    order_id: string;
    payment_method: PaymentMethod;
    amount: number;
    currency: string;
    status: string;
    mp_payment_id: string | null;
    mp_preference_id: string | null;
    mp_status: string | null;
    mp_status_detail: string | null;
    bank_reference_number: string | null;
    bank_receipt_url: string | null;
    bank_account_last_digits: string | null;
    reviewed_by: string | null;
    reviewed_at: string | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface StockReservation {
    id: string;
    product_id: string;
    order_id: string;
    quantity: number;
    expires_at: string;
    released: boolean;
    created_at: string;
}
