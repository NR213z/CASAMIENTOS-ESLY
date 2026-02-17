import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
    onClick: () => void;
}

const CartIcon = ({ onClick }: CartIconProps) => {
    const { getTotalItems } = useCart();
    const itemCount = getTotalItems();

    return (
        <button
            onClick={onClick}
            className="relative p-2 hover:text-gold transition-colors"
            aria-label="Shopping cart"
        >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in-50">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    );
};

export default CartIcon;
