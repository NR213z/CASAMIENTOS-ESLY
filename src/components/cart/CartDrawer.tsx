import { useCart } from '@/contexts/CartContext';
import CartItemCard from './CartItemCard';
import { useNavigate } from 'react-router-dom';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetOverlay,
    SheetPortal,
} from '@/components/ui/sheet';
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from '@/lib/utils';
import React from 'react';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

// Custom overlay matching the site's design
const CartOverlay = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        className={cn(
            "fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className,
        )}
        {...props}
        ref={ref}
    />
));
CartOverlay.displayName = "CartOverlay";

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { items, loading, getTotalPrice, getTotalItems } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    const total = getTotalPrice();
    const itemCount = getTotalItems();

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetPortal>
                <CartOverlay />
                <SheetPrimitive.Content
                    className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-md bg-background p-0 shadow-2xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right flex flex-col"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-warm-gray/20 flex items-center justify-between flex-shrink-0">
                        <SheetPrimitive.Title className="font-display text-2xl font-light text-foreground">
                            Carrito
                        </SheetPrimitive.Title>
                        <SheetPrimitive.Close className="text-warm-gray hover:text-foreground transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            <span className="sr-only">Close</span>
                        </SheetPrimitive.Close>
                    </div>

                    {/* Cart Items - scrollable area */}
                    <div className="flex-1 min-h-0 overflow-y-auto px-6">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                                <p className="text-warm-gray font-body text-sm">Cargando...</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-center px-4">
                                <div className="w-16 h-16 mb-6 rounded-full border-2 border-warm-gray/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-warm-gray/40">
                                        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
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
                        <div className="px-6 py-4 border-t border-warm-gray/20 space-y-4 flex-shrink-0">
                            {/* Summary */}
                            <div className="space-y-2">
                                <div className="flex justify-between font-body text-sm">
                                    <span className="text-warm-gray">
                                        Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
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
                </SheetPrimitive.Content>
            </SheetPortal>
        </Sheet>
    );
};

export default CartDrawer;
