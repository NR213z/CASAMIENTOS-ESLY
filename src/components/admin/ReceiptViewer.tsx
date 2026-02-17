import { useState, useEffect } from 'react';
import { X, Check, XCircle, Loader2, FileText, ExternalLink } from 'lucide-react';
import { supabase, Order, Payment } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ReceiptViewerProps {
  order: Order;
  payment: Payment | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function ReceiptViewer({ order, payment, onClose, onApprove, onReject }: ReceiptViewerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [signedReceiptUrl, setSignedReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    if (payment?.bank_receipt_url) {
      generateSignedUrl(payment.bank_receipt_url);
    }
  }, [payment?.bank_receipt_url]);

  const generateSignedUrl = async (rawUrl: string) => {
    // Extract file path from full URL or use as-is if already a path
    let filePath = rawUrl;
    if (rawUrl.startsWith('http')) {
      const match = rawUrl.match(/\/object\/(?:public|sign)\/(?:payment-receipts|receipts)\/(.+?)(?:\?|$)/);
      filePath = match ? match[1] : rawUrl;
    }
    const { data, error } = await supabase.storage
      .from('receipts')
      .createSignedUrl(filePath, 60 * 60); // 1 hour
    if (data?.signedUrl) {
      setSignedReceiptUrl(data.signedUrl);
    } else {
      console.error('Failed to generate signed URL:', error);
    }
  };

  const handleApprove = async () => {
    if (!payment || !user) return;

    if (!confirm('¿Estás seguro de aprobar este pago? Esta acción deducirá el stock.')) {
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('approve_bank_transfer_payment', {
        payment_uuid: payment.id,
        admin_user_id: user.id
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Error al aprobar el pago');
      }

      alert('Pago aprobado exitosamente');
      onApprove();
    } catch (error) {
      console.error('Error approving payment:', error);
      alert(error instanceof Error ? error.message : 'Error al aprobar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!payment || !user) return;

    if (!rejectionReason.trim()) {
      alert('Por favor ingresa un motivo de rechazo');
      return;
    }

    if (!confirm('¿Estás seguro de rechazar este pago? Se liberará el stock reservado.')) {
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('reject_bank_transfer_payment', {
        payment_uuid: payment.id,
        admin_user_id: user.id,
        reason: rejectionReason.trim()
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Error al rechazar el pago');
      }

      alert('Pago rechazado exitosamente');
      onReject();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert(error instanceof Error ? error.message : 'Error al rechazar el pago');
    } finally {
      setLoading(false);
    }
  };

  const receiptUrl = signedReceiptUrl || payment?.bank_receipt_url || null;
  const isImage = receiptUrl?.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);
  const isPDF = receiptUrl?.match(/\.pdf(\?|$)/i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Detalle del Pedido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3">Información del Pedido</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Número de Orden:</span>
                <p className="font-bold text-gray-900">{order.order_number}</p>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <p className="font-medium text-gray-900">{order.status}</p>
              </div>
              <div>
                <span className="text-gray-600">Cliente:</span>
                <p className="font-medium text-gray-900">{order.customer_name}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium text-gray-900">{order.customer_email}</p>
              </div>
              <div>
                <span className="text-gray-600">Teléfono:</span>
                <p className="font-medium text-gray-900">{order.customer_phone}</p>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>
                <p className="font-bold text-green-600 text-lg">${order.total.toFixed(2)}</p>
              </div>
            </div>

            {order.customer_notes && (
              <div className="mt-4">
                <span className="text-gray-600 text-sm">Notas del Cliente:</span>
                <p className="text-sm text-gray-900 mt-1 bg-white p-2 rounded">{order.customer_notes}</p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          {payment && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3">Información del Pago</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Método:</span>
                  <p className="font-medium text-gray-900">
                    {order.payment_method === 'mercadopago' ? 'Mercado Pago' : 'Transferencia Bancaria'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Estado del Pago:</span>
                  <p className="font-medium text-gray-900">{payment.status}</p>
                </div>
                {payment.bank_reference_number && (
                  <div>
                    <span className="text-gray-600">Nº de Referencia:</span>
                    <p className="font-medium text-gray-900">{payment.bank_reference_number}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Fecha de Creación:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(payment.created_at).toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Receipt Viewer */}
          {receiptUrl ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Comprobante de Pago
              </h3>

              {isImage ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={receiptUrl}
                    alt="Comprobante"
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                </div>
              ) : isPDF ? (
                <div className="border border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Archivo PDF</p>
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir PDF en Nueva Pestaña
                  </a>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p>Formato de archivo no compatible para vista previa</p>
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Descargar archivo
                  </a>
                </div>
              )}
            </div>
          ) : order.payment_method === 'bank_transfer' ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                El cliente aún no ha subido el comprobante de pago.
              </p>
            </div>
          ) : null}

          {/* Actions */}
          {order.payment_method === 'bank_transfer' && order.status === 'payment_review' && payment && (
            <div className="border-t border-gray-200 pt-4">
              {!rejecting ? (
                <div className="flex gap-4">
                  <button
                    onClick={handleApprove}
                    disabled={loading}
                    className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Aprobar Pago
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setRejecting(true)}
                    disabled={loading}
                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Rechazar Pago
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motivo del Rechazo *
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explica por qué se rechaza el pago..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleReject}
                      disabled={loading || !rejectionReason.trim()}
                      className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 mr-2" />
                          Confirmar Rechazo
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setRejecting(false);
                        setRejectionReason('');
                      }}
                      disabled={loading}
                      className="flex-1 py-3 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {order.status !== 'payment_review' && order.payment_method === 'bank_transfer' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Este pedido ya ha sido procesado. Estado actual: <strong>{order.status}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
