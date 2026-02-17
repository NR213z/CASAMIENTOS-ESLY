import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase, Order } from '../lib/supabase';
import { CheckCircle, AlertCircle, Building2, Loader2, ArrowRight } from 'lucide-react';
import ReceiptUpload from '../components/bank-transfer/ReceiptUpload';
import { BANK_TRANSFER_DETAILS } from '../config/bankTransfer';

interface LocationState {
  orderData?: {
    order: {
      id: string;
      order_number: string;
      total: number;
      payment_method: 'mercadopago' | 'bank_transfer';
      mp_preference_id?: string | null;
      init_point?: string | null;
    };
  };
}

const translatePaymentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pendiente de Pago',
    'pending_payment': 'Pendiente de Pago',
    'approved': 'Aprobado',
    'completed': 'Completado',
    'rejected': 'Rechazado',
    'cancelled': 'Cancelado',
    'payment_review': 'En Revisión',
  };
  return statusMap[status] || status;
};

const translateOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending_payment': 'Pendiente de Pago',
    'payment_received': 'Pago Recibido',
    'confirmed': 'Confirmado',
    'in_preparation': 'En Preparación',
    'ready': 'Listo para Entrega',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado',
  };
  return statusMap[status] || status;
};

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initPoint, setInitPoint] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('ID de orden no válido');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (fetchError) {
          throw new Error('No se pudo encontrar la orden');
        }

        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la orden');
      } finally {
        setLoading(false);
      }
    };

    // Try to get order from location state first (faster)
    const state = location.state as LocationState;
    if (state?.orderData) {
      // We have order data from checkout, convert to full Order type
      const partialOrder: Partial<Order> = {
        id: state.orderData.order.id,
        order_number: state.orderData.order.order_number,
        total: state.orderData.order.total,
        payment_method: state.orderData.order.payment_method,
        status: 'pending_payment',
        payment_status: 'pending'
      };
      setOrder(partialOrder as Order);
      setInitPoint(state.orderData.order.init_point || null);
      setLoading(false);
    } else {
      // Fetch from database
      fetchOrder();
    }
  }, [orderId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-rose-400 mx-auto mb-4" />
          <p className="text-gray-600">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'No se pudo cargar la orden'}</p>
          <button
            onClick={() => navigate('/productos')}
            className="inline-flex items-center px-6 py-3 bg-rose-400 text-white font-semibold rounded-lg hover:bg-rose-500 transition-colors"
          >
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-xl text-gray-600">
            Número de orden: <span className="font-bold text-rose-600">{order.order_number}</span>
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total:</span>
              <span className="text-3xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Estado del Pedido:</span>
              <span className="font-medium text-yellow-600">
                {translateOrderStatus(order.status)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estado del Pago:</span>
              <span className="font-medium text-yellow-600">
                {translatePaymentStatus(order.payment_status)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Método de pago:</span>
              <span className="font-medium">
                {order.payment_method === 'mercadopago' ? 'Mercado Pago' : 'Transferencia Bancaria'}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        {order.payment_method === 'mercadopago' ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Completar Pago con Mercado Pago</h2>
            <p className="text-gray-700 mb-4">
              Haz clic en el botón de abajo para completar tu pago de forma segura a través de Mercado Pago.
            </p>
            {initPoint ? (
              <a
                href={initPoint}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                Ir a Mercado Pago
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> El enlace de pago de Mercado Pago no está disponible.
                  Por favor contacta con soporte o selecciona transferencia bancaria como método alternativo.
                </p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3 text-center">
              Serás redirigido a Mercado Pago para completar el pago de forma segura.
              Tu reserva de stock expira en 15 minutos.
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-start mb-4">
              <Building2 className="h-6 w-6 text-green-600 mr-3 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Instrucciones para Transferencia Bancaria</h2>
                <p className="text-gray-700 mb-4">
                  Realiza la transferencia a la siguiente cuenta bancaria:
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Banco:</span>
                <span className="text-gray-900">{BANK_TRANSFER_DETAILS.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Titular:</span>
                <span className="text-gray-900">{BANK_TRANSFER_DETAILS.titular}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">CBU:</span>
                <span className="text-gray-900 font-mono">{BANK_TRANSFER_DETAILS.cbu}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Alias:</span>
                <span className="text-gray-900">{BANK_TRANSFER_DETAILS.alias}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">CUIL:</span>
                <span className="text-gray-900">{BANK_TRANSFER_DETAILS.cuil}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Tipo de Cuenta:</span>
                <span className="text-gray-900">{BANK_TRANSFER_DETAILS.accountType}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold text-gray-900">Monto a transferir:</span>
                <span className="font-bold text-green-600 text-lg">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> En el concepto de la transferencia, incluye tu número de orden:{' '}
                <span className="font-bold">{order.order_number}</span>
              </p>
            </div>

            <div className="border-t border-green-200 pt-4">
              <ReceiptUpload orderId={order.id} />
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">¿Qué sigue?</h2>
          <ol className="space-y-3 text-gray-700">
            {order.payment_method === 'mercadopago' ? (
              <>
                <li className="flex items-start">
                  <span className="font-bold text-rose-600 mr-2">1.</span>
                  <span>Completa el pago a través de Mercado Pago</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-rose-600 mr-2">2.</span>
                  <span>Recibirás un email de confirmación una vez que se apruebe el pago</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-rose-600 mr-2">3.</span>
                  <span>Prepararemos tu pedido y te contactaremos para coordinar la entrega</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <span className="font-bold text-rose-600 mr-2">1.</span>
                  <span>Realiza la transferencia bancaria con los datos proporcionados</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-rose-600 mr-2">2.</span>
                  <span>Sube tu comprobante de pago usando el botón de arriba</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-rose-600 mr-2">3.</span>
                  <span>Verificaremos tu pago (esto puede tomar hasta 24 horas hábiles)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-rose-600 mr-2">4.</span>
                  <span>Te contactaremos por email una vez confirmado para coordinar la entrega</span>
                </li>
              </>
            )}
          </ol>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-2">
            <strong>¿Tienes preguntas?</strong>
          </p>
          <p className="text-gray-600 text-sm">
            Contáctanos a{' '}
            <a href={`mailto:${order.customer_email}`} className="text-rose-600 hover:underline">
              contacto@eslycasamientos.com
            </a>
          </p>
        </div>

        {/* Back to Products */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/productos')}
            className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Volver a Productos
          </button>
        </div>
      </div>
    </div>
  );
}
