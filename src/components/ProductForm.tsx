import { useState, FormEvent, ChangeEvent } from 'react';
import { supabase, Product, ProductInsert } from '@/lib/supabase';
import { X, Upload, Loader2 } from 'lucide-react';

interface ProductFormProps {
    product?: Product | null;
    onClose: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ProductForm = ({ product, onClose }: ProductFormProps) => {
    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState(product?.description || '');
    const [price, setPrice] = useState(product?.price.toString() || '');
    const [category, setCategory] = useState(product?.category || '');
    const [inStock, setInStock] = useState(product?.in_stock ?? true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(product?.image_url || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('La imagen no debe superar los 5MB');
                return;
            }
            setError('');
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return null;
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let imageUrl = product?.image_url || null;

            // Upload new image if selected
            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (!uploadedUrl) {
                    throw new Error('Error al subir la imagen. Verifica que el bucket "product-images" exista y sea público en Supabase.');
                }
                imageUrl = uploadedUrl;
            }

            const productData: ProductInsert = {
                name,
                description: description || null,
                price: parseFloat(price) || 0,
                category: category || null,
                image_url: imageUrl,
                in_stock: inStock,
            };

            if (product) {
                // Update existing product
                const { error } = await supabase
                    .from('products')
                    .update({ ...productData, updated_at: new Date().toISOString() })
                    .eq('id', product.id);

                if (error) throw error;
            } else {
                // Create new product
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);

                if (error) throw error;
            }

            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al guardar el producto');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-background border border-gold/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-background border-b border-warm-gray/20 px-6 py-4 flex items-center justify-between">
                    <h2 className="font-display text-2xl font-light text-foreground">
                        {product ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-warm-gray hover:text-foreground transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs uppercase tracking-[0.2em] text-foreground/70 font-body mb-2"
                        >
                            Nombre del Producto *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-warm-gray/30 bg-background text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors"
                            placeholder="Ej: Centro de mesa elegante"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-xs uppercase tracking-[0.2em] text-foreground/70 font-body mb-2"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-warm-gray/30 bg-background text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                            placeholder="Describe el producto..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="price"
                                className="block text-xs uppercase tracking-[0.2em] text-foreground/70 font-body mb-2"
                            >
                                Precio *
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">
                                    $
                                </span>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full pl-8 pr-4 py-3 border border-warm-gray/30 bg-background text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="category"
                                className="block text-xs uppercase tracking-[0.2em] text-foreground/70 font-body mb-2"
                            >
                                Categoría
                            </label>
                            <input
                                type="text"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-warm-gray/30 bg-background text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors"
                                placeholder="Ej: Decoración"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setInStock(!inStock)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                                inStock ? 'bg-gold' : 'bg-warm-gray/30'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                    inStock ? 'translate-x-6' : 'translate-x-0'
                                }`}
                            />
                        </button>
                        <label className="text-sm text-foreground font-body">
                            {inStock ? 'En stock' : 'Sin stock'}
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-foreground/70 font-body mb-2">
                            Imagen del Producto
                        </label>
                        {imagePreview && (
                            <div className="mb-4 aspect-[4/3] bg-sand overflow-hidden">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <label className="block cursor-pointer">
                            <div className="border-2 border-dashed border-warm-gray/30 hover:border-gold/50 transition-colors p-8 text-center">
                                <Upload className="mx-auto mb-3 text-warm-gray" size={32} />
                                <p className="text-sm text-foreground font-body mb-1">
                                    Click para seleccionar una imagen
                                </p>
                                <p className="text-xs text-warm-gray/70 font-body">
                                    JPG, PNG o WEBP (máx. 5MB)
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-warm-gray/30 text-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] font-body hover:border-gold hover:text-gold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-charcoal text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="animate-spin" size={16} />}
                            {loading ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
