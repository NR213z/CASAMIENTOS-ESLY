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
