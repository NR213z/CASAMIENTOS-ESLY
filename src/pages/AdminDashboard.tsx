import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Product, Order, Payment } from '@/lib/supabase';
import ProductForm from '@/components/ProductForm';
import { LogOut, Plus, Edit, Trash2, Package, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tab = 'productos' | 'pedidos';

const statusLabel: Record<string, { label: string; color: string }> = {
    pending:   { label: 'Pendiente',  color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    verified:  { label: 'Verificado', color: 'text-green-600 bg-green-50 border-green-200' },
    rejected:  { label: 'Rechazado', color: 'text-red-600 bg-red-50 border-red-200' },
    confirmed: { label: 'Confirmado', color: 'text-green-600 bg-green-50 border-green-200' },
    cancelled: { label: 'Cancelado',  color: 'text-red-600 bg-red-50 border-red-200' },
};

interface OrderWithPayments extends Order {
    payments: Payment[];
}

const AdminDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('pedidos');

    // Products
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Orders
    const [orders, setOrders] = useState<OrderWithPayments[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [receiptUrls, setReceiptUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    // ── Products ──────────────────────────────────────────────────────────

    const fetchProducts = async () => {
        setLoadingProducts(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setProducts(data || []);
        setLoadingProducts(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) { alert('Error al eliminar el producto'); return; }
        fetchProducts();
    };

    // ── Orders ────────────────────────────────────────────────────────────

    const fetchOrders = async () => {
        setLoadingOrders(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*, payments(*)')
            .order('created_at', { ascending: false });

        if (error) { console.error(error); setLoadingOrders(false); return; }

        const ordersData = (data || []) as OrderWithPayments[];
        setOrders(ordersData);

        // Generate signed URLs for all receipts
        const urls: Record<string, string> = {};
        for (const order of ordersData) {
            for (const payment of order.payments || []) {
                if (payment.receipt_url) {
                    const { data: signed } = await supabase.storage
                        .from('receipts')
                        .createSignedUrl(payment.receipt_url, 60 * 60); // 1 hour
                    if (signed?.signedUrl) {
                        urls[payment.id] = signed.signedUrl;
                    }
                }
            }
        }
        setReceiptUrls(urls);
        setLoadingOrders(false);
    };

    const updatePaymentStatus = async (paymentId: string, status: 'verified' | 'rejected') => {
        const { error } = await supabase
            .from('payments')
            .update({ status })
            .eq('id', paymentId);
        if (error) { console.error(error); return; }
        fetchOrders();
    };

    const updateOrderStatus = async (orderId: string, status: 'confirmed' | 'cancelled') => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);
        if (error) { console.error(error); return; }
        fetchOrders();
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

                {/* Tabs */}
                <div className="container mx-auto px-6 flex gap-0 border-t border-gold/10">
                    {(['pedidos', 'productos'] as Tab[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-6 py-3 text-xs uppercase tracking-[0.2em] font-body transition-colors border-b-2 ${
                                tab === t
                                    ? 'border-gold text-foreground'
                                    : 'border-transparent text-warm-gray hover:text-foreground'
                            }`}
                        >
                            {t === 'pedidos' ? 'Pedidos' : 'Productos'}
                        </button>
                    ))}
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">

                {/* ── PEDIDOS TAB ── */}
                {tab === 'pedidos' && (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-display text-2xl md:text-3xl font-light text-foreground">Pedidos</h2>
                            <button onClick={fetchOrders} className="text-xs uppercase tracking-[0.2em] text-warm-gray font-body hover:text-foreground transition-colors">
                                Actualizar
                            </button>
                        </div>

                        {loadingOrders ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4" />
                                <p className="text-warm-gray font-body">Cargando pedidos...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20 bg-background border border-gold/20 p-12">
                                <Package size={48} strokeWidth={1} className="mx-auto text-warm-gray/30 mb-4" />
                                <p className="text-warm-gray font-body">No hay pedidos aún</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-background border border-warm-gray/20 overflow-hidden">
                                        {/* Order header */}
                                        <div className="px-6 py-4 border-b border-warm-gray/10 flex flex-wrap gap-4 items-start justify-between">
                                            <div>
                                                <p className="font-body text-xs uppercase tracking-[0.15em] text-warm-gray mb-1">
                                                    Pedido #{order.id.slice(0, 8).toUpperCase()}
                                                </p>
                                                <p className="font-display text-xl font-light text-foreground">{order.customer_name}</p>
                                                <p className="font-body text-sm text-warm-gray">{order.customer_email}</p>
                                                {order.customer_phone && (
                                                    <p className="font-body text-sm text-warm-gray">{order.customer_phone}</p>
                                                )}
                                                {order.notes && (
                                                    <p className="font-body text-sm text-warm-gray/70 mt-1 italic">"{order.notes}"</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gold font-body text-xl mb-2">${order.total_amount.toLocaleString()}</p>
                                                <span className={`inline-block text-xs uppercase tracking-[0.1em] px-3 py-1 border font-body ${statusLabel[order.status]?.color}`}>
                                                    {statusLabel[order.status]?.label}
                                                </span>
                                                <p className="text-warm-gray/50 font-body text-xs mt-2">
                                                    {new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payments / receipts */}
                                        {order.payments?.length > 0 ? (
                                            <div className="px-6 py-4">
                                                <p className="text-xs uppercase tracking-[0.15em] text-warm-gray font-body mb-3">Comprobantes</p>
                                                {order.payments.map(payment => (
                                                    <div key={payment.id} className="flex flex-wrap gap-4 items-center justify-between py-3 border-t border-warm-gray/10 first:border-t-0">
                                                        <div className="flex items-center gap-4">
                                                            {/* Receipt preview */}
                                                            {receiptUrls[payment.id] ? (
                                                                <a href={receiptUrls[payment.id]} target="_blank" rel="noopener noreferrer" className="group relative">
                                                                    <img
                                                                        src={receiptUrls[payment.id]}
                                                                        alt="Comprobante"
                                                                        className="w-20 h-20 object-cover border border-warm-gray/20 group-hover:border-gold transition-colors"
                                                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                                    />
                                                                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-all flex items-center justify-center">
                                                                        <ExternalLink size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    </div>
                                                                </a>
                                                            ) : (
                                                                <div className="w-20 h-20 border border-warm-gray/20 flex items-center justify-center bg-sand">
                                                                    <Clock size={20} className="text-warm-gray/30" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-body text-sm text-foreground">${payment.amount.toLocaleString()}</p>
                                                                <p className="font-body text-xs text-warm-gray capitalize">{payment.payment_method || 'Transferencia'}</p>
                                                                <span className={`inline-block text-xs uppercase tracking-[0.1em] px-2 py-0.5 border font-body mt-1 ${statusLabel[payment.status]?.color}`}>
                                                                    {statusLabel[payment.status]?.label}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        {payment.status === 'pending' && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => updatePaymentStatus(payment.id, 'verified')}
                                                                    className="flex items-center gap-1.5 border border-green-300 text-green-700 px-4 py-2 text-xs uppercase tracking-[0.15em] font-body hover:bg-green-50 transition-colors"
                                                                >
                                                                    <CheckCircle size={14} />
                                                                    Verificar
                                                                </button>
                                                                <button
                                                                    onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                                                                    className="flex items-center gap-1.5 border border-red-200 text-red-600 px-4 py-2 text-xs uppercase tracking-[0.15em] font-body hover:bg-red-50 transition-colors"
                                                                >
                                                                    <XCircle size={14} />
                                                                    Rechazar
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Order-level actions */}
                                                {order.status === 'pending' && order.payments.some(p => p.status === 'verified') && (
                                                    <div className="flex gap-2 mt-4 pt-4 border-t border-warm-gray/10">
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                            className="bg-charcoal text-primary-foreground px-6 py-2 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors"
                                                        >
                                                            Confirmar pedido
                                                        </button>
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                            className="border border-red-200 text-red-600 px-6 py-2 text-xs uppercase tracking-[0.2em] font-body hover:bg-red-50 transition-colors"
                                                        >
                                                            Cancelar pedido
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="px-6 py-4">
                                                <p className="text-warm-gray/50 font-body text-sm italic">Sin comprobante adjunto</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ── PRODUCTOS TAB ── */}
                {tab === 'productos' && (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-display text-2xl md:text-3xl font-light text-foreground">Productos</h2>
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 bg-charcoal text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors"
                            >
                                <Plus size={16} />
                                Nuevo Producto
                            </button>
                        </div>

                        {loadingProducts ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4" />
                                <p className="text-warm-gray font-body">Cargando productos...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-background border border-gold/20 p-12">
                                <p className="text-warm-gray font-body text-lg mb-4">No hay productos aún</p>
                                <p className="text-warm-gray/70 font-body text-sm">Comienza agregando tu primer producto</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <div key={product.id} className="bg-background border border-warm-gray/20 overflow-hidden hover:border-gold/40 transition-colors group">
                                        <div className="aspect-[4/3] bg-sand relative overflow-hidden">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <p className="text-warm-gray/40 font-display text-xl italic">Sin imagen</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-display text-xl font-light text-foreground mb-2">{product.name}</h3>
                                            {product.category && (
                                                <p className="text-xs uppercase tracking-[0.15em] text-warm-gray font-body mb-1">{product.category}</p>
                                            )}
                                            <p className="text-lg text-gold font-body mb-1">${product.price.toLocaleString()}</p>
                                            {!product.in_stock && <p className="text-xs text-red-500 font-body mb-2">Sin stock</p>}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setEditingProduct(product); setShowForm(true); }}
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
                    </>
                )}
            </main>

            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onClose={() => { setShowForm(false); setEditingProduct(null); fetchProducts(); }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
