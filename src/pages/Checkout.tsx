import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Building2, Loader2, ShoppingBag } from 'lucide-react';

// Validation schema
const checkoutSchema = z.object({
  customer_name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es muy largo'),
  customer_email: z.string()
    .email('Email inválido')
    .max(100, 'El email es muy largo'),
  customer_phone: z.string()
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(20, 'El teléfono es muy largo')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono solo puede contener números, +, -, espacios y paréntesis'),
  payment_method: z.enum(['mercadopago', 'bank_transfer'], {
    required_error: 'Debes seleccionar un método de pago'
  }).default('bank_transfer'),
  customer_notes: z.string().max(500, 'Las notas son muy largas').optional()
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: 'bank_transfer'
    }
  });

  const selectedPaymentMethod = watch('payment_method');
  const totalPrice = getTotalPrice();

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega productos antes de continuar con el pago</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-6 py-3 bg-rose-400 text-white font-semibold rounded-lg hover:bg-rose-500 transition-colors"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);

      const cartSessionId = localStorage.getItem('cartSessionId') || '';

      // Call Edge Function to create order
      const { data: responseData, error } = await supabase.functions.invoke('create-order', {
        body: {
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          payment_method: data.payment_method,
          customer_notes: data.customer_notes,
          items: items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price_snapshot: item.price_snapshot
          })),
          cart_session_id: cartSessionId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!responseData.success) {
        throw new Error(responseData.error || 'Error al crear el pedido');
      }

      // Navigate to order confirmation
      navigate(`/order-confirmation/${responseData.order.id}`, {
        state: { orderData: responseData }
      });
    } catch (error) {
      console.error('Error creating order:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Error al crear el pedido. Por favor intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Finalizar Compra
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary - Left Side */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ${(item.price_snapshot * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Envío</span>
                  <span>A coordinar</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </div>
          </div>

          {/* Checkout Form - Right Side */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8">
              {/* Customer Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Contacto</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      {...register('customer_name')}
                      type="text"
                      id="customer_name"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent ${
                        errors.customer_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Juan Pérez"
                    />
                    {errors.customer_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      {...register('customer_email')}
                      type="email"
                      id="customer_email"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent ${
                        errors.customer_email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="juan@ejemplo.com"
                    />
                    {errors.customer_email && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      {...register('customer_phone')}
                      type="tel"
                      id="customer_phone"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent ${
                        errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+54 9 11 1234-5678"
                    />
                    {errors.customer_phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="customer_notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      {...register('customer_notes')}
                      id="customer_notes"
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent ${
                        errors.customer_notes ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Instrucciones especiales para tu pedido..."
                    />
                    {errors.customer_notes && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_notes.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Método de Pago</h2>

                <div className="space-y-3">
                  {/* Mercado Pago - Oculto temporalmente, descomentar cuando se habilite
                  <label
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'mercadopago'
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      {...register('payment_method')}
                      type="radio"
                      value="mercadopago"
                      className="w-4 h-4 text-rose-400 focus:ring-rose-400"
                    />
                    <div className="ml-3 flex items-center flex-1">
                      <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">Mercado Pago</p>
                        <p className="text-sm text-gray-600">Pago online con tarjeta</p>
                      </div>
                    </div>
                  </label>
                  */}

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'bank_transfer'
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      {...register('payment_method')}
                      type="radio"
                      value="bank_transfer"
                      className="w-4 h-4 text-rose-400 focus:ring-rose-400"
                    />
                    <div className="ml-3 flex items-center flex-1">
                      <Building2 className="h-5 w-5 text-gray-600 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">Transferencia Bancaria</p>
                        <p className="text-sm text-gray-600">Pago manual con comprobante</p>
                      </div>
                    </div>
                  </label>
                </div>

                {errors.payment_method && (
                  <p className="mt-2 text-sm text-red-600">{errors.payment_method.message}</p>
                )}

                {/* Payment method info */}
                {selectedPaymentMethod === 'bank_transfer' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> Después de confirmar tu pedido, recibirás los datos bancarios
                      para realizar la transferencia. Deberás subir el comprobante para que procesemos tu orden.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-rose-400 text-white font-bold text-lg rounded-lg hover:bg-rose-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>Confirmar Pedido</>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Al confirmar tu pedido, aceptas nuestros términos y condiciones
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
