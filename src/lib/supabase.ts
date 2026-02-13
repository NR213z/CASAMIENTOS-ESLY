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
    title: string;
    price: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProductInsert {
    title: string;
    price: number;
    image_url?: string | null;
}

export interface ProductUpdate {
    title?: string;
    price?: number;
    image_url?: string | null;
    updated_at?: string;
}
