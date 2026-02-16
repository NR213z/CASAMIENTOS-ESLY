import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/lib/supabase';

interface CartItemCardProps {
    item: CartItem;
}

const CartItemCard = ({ item }: CartItemCardProps) => {
    const { updateQuantity, removeFromCart } = useCart();

    const handleDecrease = async () => {
        if (item.quantity > 1) {
            await updateQuantity(item.product_id, item.quantity - 1);
        }
    };

    const handleIncrease = async () => {
        await updateQuantity(item.product_id, item.quantity + 1);
    };

    const handleRemove = async () => {
        await removeFromCart(item.product_id);
    };

    const subtotal = item.price_snapshot * item.quantity;

    return (
        <div className="flex gap-4 py-4 border-b border-warm-gray/20">
            {/* Product Image */}
            <div className="w-20 h-20 bg-sand flex-shrink-0 overflow-hidden">
                {item.product?.image_url ? (
                    <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-warm-gray/40 text-xs">Sin imagen</span>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <h4 className="font-display text-base font-light text-foreground truncate">
                    {item.product?.name}
                </h4>
                {item.product?.category && (
                    <p className="text-xs text-warm-gray font-body mt-1">
                        {item.product.category}
                    </p>
                )}
                <p className="text-sm text-gold font-body mt-2">
                    ${item.price_snapshot.toLocaleString()}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                    <button
                        onClick={handleDecrease}
                        className="w-7 h-7 border border-warm-gray/30 flex items-center justify-center hover:border-gold transition-colors"
                        aria-label="Decrease quantity"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="font-body text-sm min-w-[2ch] text-center">
                        {item.quantity}
                    </span>
                    <button
                        onClick={handleIncrease}
                        className="w-7 h-7 border border-warm-gray/30 flex items-center justify-center hover:border-gold transition-colors"
                        aria-label="Increase quantity"
                    >
                        <Plus size={14} />
                    </button>
                    <button
                        onClick={handleRemove}
                        className="ml-auto text-warm-gray hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Subtotal */}
            <div className="text-right">
                <p className="font-body text-sm text-foreground">
                    ${subtotal.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default CartItemCard;
