import { useEffect, useState } from 'react';
import { supabase, Product } from '../../lib/supabase';
import { AlertTriangle, X } from 'lucide-react';

export default function LowStockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchLowStockProducts();

    // Set up realtime subscription
    const channel = supabase
      .channel('products-stock-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchLowStockProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('stock_quantity.lte.low_stock_threshold,stock_quantity.eq.0')
        .order('stock_quantity', { ascending: true });

      if (error) throw error;

      setLowStockProducts(data || []);
      setDismissed(false);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  if (dismissed || lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-amber-600 hover:text-amber-800"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-bold text-amber-800 mb-2">
            Alerta de Stock Bajo
          </h3>
          <p className="text-sm text-amber-700 mb-3">
            Los siguientes productos tienen stock bajo o están agotados:
          </p>
          <div className="space-y-2">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded p-2 flex items-center justify-between text-sm"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <span className="text-gray-500 ml-2">
                    ({product.category || 'Sin categoría'})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-gray-600">Stock disponible:</span>
                    <p className={`font-bold ${
                      product.stock_quantity === 0
                        ? 'text-red-600'
                        : product.stock_quantity <= product.low_stock_threshold
                        ? 'text-amber-600'
                        : 'text-gray-900'
                    }`}>
                      {product.stock_quantity - product.reserved_quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-600">Reservado:</span>
                    <p className="font-medium text-blue-600">
                      {product.reserved_quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-600">Total:</span>
                    <p className="font-medium text-gray-900">
                      {product.stock_quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-600 mt-3">
            💡 Considera reabastecer estos productos para evitar perder ventas.
          </p>
        </div>
      </div>
    </div>
  );
}
