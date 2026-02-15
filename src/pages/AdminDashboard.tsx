import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Product } from '@/lib/supabase';
import ProductForm from '@/components/ProductForm';
import { LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            // Error silenciado en producción
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            return;
        }

        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            alert('Error al eliminar el producto');
        } else {
            fetchProducts();
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts();
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-sand">
            {/* Header */}
            <header className="bg-background border-b border-gold/20 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl font-light text-foreground">
                            Panel de Administración
                        </h1>
                        <p className="text-xs text-warm-gray font-body mt-1">
                            Bienvenido, {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-warm-gray hover:text-foreground transition-colors font-body"
                    >
                        <LogOut size={16} />
                        Salir
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display text-2xl md:text-3xl font-light text-foreground">
                        Productos
                    </h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-charcoal text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors"
                    >
                        <Plus size={16} />
                        Nuevo Producto
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                        <p className="text-warm-gray font-body">Cargando productos...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-background border border-gold/20 p-12">
                        <p className="text-warm-gray font-body text-lg mb-4">
                            No hay productos aún
                        </p>
                        <p className="text-warm-gray/70 font-body text-sm">
                            Comienza agregando tu primer producto
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-background border border-warm-gray/20 overflow-hidden hover:border-gold/40 transition-colors group"
                            >
                                <div className="aspect-[4/3] bg-sand relative overflow-hidden">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <p className="text-warm-gray/40 font-display text-xl italic">
                                                Sin imagen
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="font-display text-xl font-light text-foreground mb-2">
                                        {product.name}
                                    </h3>
                                    {product.category && (
                                        <p className="text-xs uppercase tracking-[0.15em] text-warm-gray font-body mb-1">
                                            {product.category}
                                        </p>
                                    )}
                                    <p className="text-lg text-gold font-body mb-1">
                                        ${product.price.toLocaleString()}
                                    </p>
                                    {!product.in_stock && (
                                        <p className="text-xs text-red-500 font-body mb-2">Sin stock</p>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 flex items-center justify-center gap-2 border border-warm-gray/30 text-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] font-body hover:border-gold hover:text-gold transition-colors"
                                        >
                                            <Edit size={14} />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 px-4 py-2 text-xs uppercase tracking-[0.2em] font-body hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Product Form Modal */}
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
