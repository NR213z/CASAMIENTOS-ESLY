import { supabase } from '../lib/supabaseClient';

/**
 * Fetch all products from Supabase
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { data: null, error };
    }
};

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product object
 */
export const getProductById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { data: null, error };
    }
};

/**
 * Create a new product (Admin function)
 * @param {Object} product - Product data
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (product) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating product:', error);
        return { data: null, error };
    }
};

/**
 * Update an existing product (Admin function)
 * @param {string} id - Product ID
 * @param {Object} updates - Product updates
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating product:', error);
        return { data: null, error };
    }
};

/**
 * Delete a product (Admin function)
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProduct = async (id) => {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { error };
    }
};

/**
 * Search products by name or description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Matching products
 */
export const searchProducts = async (searchTerm) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error searching products:', error);
        return { data: null, error };
    }
};

/**
 * Filter products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Filtered products
 */
export const getProductsByCategory = async (category) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return { data: null, error };
    }
};
