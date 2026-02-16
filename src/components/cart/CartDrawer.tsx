import { X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartItemCard from './CartItemCard';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { items, loading, getTotalPrice, getTotalItems } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    const total = getTotalPrice();
    const itemCount = getTotalItems();

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-warm-gray/20 flex items-center justify-between">
                    <h2 className="font-display text-2xl font-light text-foreground">
                        Carrito
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-warm-gray hover:text-foreground transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6">
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                            <p className="text-warm-gray font-body text-sm">Cargando...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-warm-gray font-body">
                                Tu carrito está vacío
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-6 text-gold hover:text-gold/80 font-body text-sm underline"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {items.map(item => (
                                <CartItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="px-6 py-4 border-t border-warm-gray/20 space-y-4">
                        {/* Summary */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-body text-sm">
                                <span className="text-warm-gray">
                                    Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                                </span>
                                <span className="text-foreground">
                                    ${total.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between font-display text-lg">
                                <span className="text-foreground">Total</span>
                                <span className="text-gold">${total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-charcoal text-primary-foreground py-4 text-xs uppercase tracking-[0.3em] font-body hover:bg-charcoal/90 transition-colors"
                        >
                            Proceder al Pago
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full border border-warm-gray/30 text-foreground py-3 text-xs uppercase tracking-[0.2em] font-body hover:border-gold hover:text-gold transition-colors"
                        >
                            Continuar Comprando
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
