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
                className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-[60]"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
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
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center px-4">
                            <div className="w-16 h-16 mb-6 rounded-full border-2 border-warm-gray/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-warm-gray/40">
                                    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                                </svg>
                            </div>
                            <p className="text-foreground font-display text-lg mb-2">
                                Tu carrito está vacío
                            </p>
                            <p className="text-warm-gray/60 font-body text-sm mb-8">
                                Explorá nuestros productos y encontrá algo especial
                            </p>
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate('/productos');
                                }}
                                className="bg-charcoal text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors"
                            >
                                Ver Productos
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
