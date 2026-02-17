import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import { Minus, Plus, Trash2, Upload, CheckCircle } from 'lucide-react';

type Step = 'cart' | 'form' | 'receipt' | 'done';

interface CustomerForm {
    name: string;
    email: string;
    phone: string;
    notes: string;
}

const Cart = () => {
    const navigate = useNavigate();
    const { items, total, removeItem, updateQuantity, clearCart, sessionToken } = useCart();
    const [step, setStep] = useState<Step>('cart');
    const [form, setForm] = useState<CustomerForm>({ name: '', email: '', phone: '', notes: '' });
    const [orderId, setOrderId] = useState<string | null>(null);
    const [receipt, setReceipt] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.email) {
            setError('Nombre y email son obligatorios.');
            return;
        }

        try {
            // Create order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    cart_session_id: null,
                    customer_name: form.name,
                    customer_email: form.email,
                    customer_phone: form.phone || null,
                    total_amount: total,
                    status: 'pending',
                    notes: form.notes || null,
                })
                .select('id')
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
            if (itemsError) throw itemsError;

            setOrderId(order.id);
            setStep('receipt');
        } catch (err: any) {
            setError('Error al crear el pedido. Intenta nuevamente.');
            console.error(err);
        }
    };

    const handleReceiptUpload = async () => {
        if (!receipt || !orderId) return;
        setUploading(true);
        setError('');

        try {
            const ext = receipt.name.split('.').pop();
            const fileName = `${orderId}_${Date.now()}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(fileName, receipt);

            if (uploadError) throw uploadError;

            // Create payment record with file path (not public URL)
            const { error: paymentError } = await supabase.from('payments').insert({
                order_id: orderId,
                amount: total,
                payment_method: 'transferencia',
                receipt_url: fileName,
                status: 'pending',
            });

            if (paymentError) throw paymentError;

            await clearCart();
            setStep('done');
        } catch (err: any) {
            setError('Error al subir el comprobante. Intenta nuevamente.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    if (step === 'done') {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-background flex items-center justify-center pt-24 pb-16">
                    <div className="text-center px-6 max-w-md">
                        <CheckCircle className="mx-auto mb-6 text-gold" size={64} strokeWidth={1} />
                        <h1 className="font-display text-4xl font-light text-foreground mb-4">
                            ¡Pedido recibido!
                        </h1>
                        <p className="text-warm-gray font-body mb-2">
                            Gracias por tu comprobante. Verificaremos tu pago y nos pondremos en contacto.
                        </p>
                        <p className="text-warm-gray/60 font-body text-sm mb-8">
                            Número de pedido: <span className="font-medium text-foreground">{orderId?.slice(0, 8).toUpperCase()}</span>
                        </p>
                        <button
                            onClick={() => navigate('/productos')}
                            className="bg-charcoal text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors"
                        >
                            Seguir comprando
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-background pt-28 pb-16">
                <div className="container mx-auto px-6 max-w-3xl">

                    {/* Steps indicator */}
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        {(['cart', 'form', 'receipt'] as Step[]).map((s, i) => (
                            <div key={s} className="flex items-center gap-4">
                                <div className={`flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-body ${step === s ? 'text-foreground' : 'text-warm-gray/40'}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === s ? 'bg-charcoal text-primary-foreground' : 'border border-warm-gray/30 text-warm-gray/40'}`}>
                                        {i + 1}
                                    </span>
                                    {s === 'cart' ? 'Carrito' : s === 'form' ? 'Datos' : 'Comprobante'}
                                </div>
                                {i < 2 && <div className="w-8 h-px bg-warm-gray/20" />}
                            </div>
                        ))}
                    </div>

                    {/* STEP: Cart */}
                    {step === 'cart' && (
                        <>
                            <h1 className="font-display text-3xl font-light text-foreground mb-8">Tu carrito</h1>

                            {items.length === 0 ? (
                                <div className="text-center py-20 border border-gold/20">
                                    <p className="text-warm-gray font-body mb-6">Tu carrito está vacío</p>
                                    <button onClick={() => navigate('/productos')} className="bg-charcoal text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors">
                                        Ver productos
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-8">
                                        {items.map(item => (
                                            <div key={item.id} className="flex gap-4 bg-background border border-warm-gray/20 p-4">
                                                {item.product?.image_url && (
                                                    <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 object-cover flex-shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-display text-lg font-light text-foreground truncate">{item.product?.name}</p>
                                                    <p className="text-gold font-body">${item.unit_price.toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border border-warm-gray/30 flex items-center justify-center hover:border-gold transition-colors">
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 border border-warm-gray/30 flex items-center justify-center hover:border-gold transition-colors">
                                                        <Plus size={12} />
                                                    </button>
                                                    <button onClick={() => removeItem(item.id)} className="w-7 h-7 text-red-400 hover:text-red-600 flex items-center justify-center ml-2 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-warm-gray/20 pt-6">
                                        <div>
                                            <p className="text-warm-gray font-body text-sm uppercase tracking-[0.15em]">Total</p>
                                            <p className="font-display text-3xl font-light text-foreground">${total.toLocaleString()}</p>
                                        </div>
                                        <button onClick={() => setStep('form')} className="bg-charcoal text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors">
                                            Continuar
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* STEP: Customer form */}
                    {step === 'form' && (
                        <>
                            <h1 className="font-display text-3xl font-light text-foreground mb-8">Tus datos</h1>
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.15em] text-warm-gray font-body mb-2">Nombre completo *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full border border-warm-gray/30 bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:border-gold transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.15em] text-warm-gray font-body mb-2">Email *</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full border border-warm-gray/30 bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:border-gold transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.15em] text-warm-gray font-body mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        className="w-full border border-warm-gray/30 bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:border-gold transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.15em] text-warm-gray font-body mb-2">Notas del pedido</label>
                                    <textarea
                                        value={form.notes}
                                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                        rows={3}
                                        className="w-full border border-warm-gray/30 bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:border-gold transition-colors resize-none"
                                    />
                                </div>

                                {error && <p className="text-red-500 font-body text-sm">{error}</p>}

                                <div className="flex gap-4 pt-2">
                                    <button type="button" onClick={() => setStep('cart')} className="flex-1 border border-warm-gray/30 text-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] font-body hover:border-gold transition-colors">
                                        Volver
                                    </button>
                                    <button type="submit" className="flex-1 bg-charcoal text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors">
                                        Confirmar pedido
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* STEP: Receipt upload */}
                    {step === 'receipt' && (
                        <>
                            <h1 className="font-display text-3xl font-light text-foreground mb-4">Comprobante de pago</h1>
                            <p className="text-warm-gray font-body mb-2">
                                Realiza la transferencia por <span className="text-gold font-medium">${total.toLocaleString()}</span> y sube la foto o captura del comprobante.
                            </p>
                            <p className="text-warm-gray/60 font-body text-sm mb-8">
                                Pedido #{orderId?.slice(0, 8).toUpperCase()}
                            </p>

                            <div
                                onClick={() => fileRef.current?.click()}
                                className={`border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-16 transition-colors mb-6 ${
                                    receipt ? 'border-gold bg-gold/5' : 'border-warm-gray/30 hover:border-gold/60'
                                }`}
                            >
                                <Upload size={32} strokeWidth={1} className={receipt ? 'text-gold' : 'text-warm-gray/40'} />
                                <p className="font-body text-sm mt-3 text-warm-gray">
                                    {receipt ? receipt.name : 'Haz clic para seleccionar imagen'}
                                </p>
                                <p className="font-body text-xs text-warm-gray/40 mt-1">JPG, PNG, PDF — máx. 10 MB</p>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={e => setReceipt(e.target.files?.[0] || null)}
                                />
                            </div>

                            {error && <p className="text-red-500 font-body text-sm mb-4">{error}</p>}

                            <button
                                onClick={handleReceiptUpload}
                                disabled={!receipt || uploading}
                                className="w-full bg-charcoal text-primary-foreground py-4 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Enviando...' : 'Enviar comprobante'}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
