import { useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ReceiptUploadProps {
  orderId: string;
  onUploadSuccess?: () => void;
}

export default function ReceiptUpload({ orderId, onUploadSuccess }: ReceiptUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [bankReference, setBankReference] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Tipo de archivo no válido. Solo se permiten JPG, PNG, WEBP y PDF');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('El archivo es muy grande. Tamaño máximo: 5MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Generate preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // 1. Upload file directly to 'receipts' bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `receipts/${orderId}_${crypto.randomUUID()}.${fileExt}`;

      const { error: storageError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file, { contentType: file.type, upsert: false });

      if (storageError) throw new Error(`Error al subir archivo: ${storageError.message}`);

      // 2. Check if payment record exists for this order
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('order_id', orderId)
        .eq('payment_method', 'bank_transfer')
        .single();

      if (existingPayment) {
        // Update existing payment
        const { error: updateErr } = await supabase
          .from('payments')
          .update({
            bank_receipt_url: fileName,
            bank_reference_number: bankReference.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingPayment.id);
        if (updateErr) throw updateErr;
      } else {
        // Create new payment record
        const { error: insertErr } = await supabase
          .from('payments')
          .insert({
            order_id: orderId,
            payment_method: 'bank_transfer',
            amount: 0,
            currency: 'ARS',
            status: 'pending',
            bank_receipt_url: fileName,
            bank_reference_number: bankReference.trim() || null,
          });
        if (insertErr) throw insertErr;
      }

      // 3. Update order status to payment_review
      await supabase
        .from('orders')
        .update({ status: 'payment_review', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      setSuccess(true);
      setFile(null);
      setPreview(null);
      setBankReference('');

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error uploading receipt:', err);
      setError(err instanceof Error ? err.message : 'Error al subir el comprobante');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center">
        <Upload className="h-5 w-5 mr-2 text-green-600" />
        Subir Comprobante de Pago
      </h3>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">¡Comprobante subido exitosamente!</p>
            <p className="text-xs text-green-700 mt-1">
              Tu pago está en revisión. Te contactaremos pronto.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* File input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona el comprobante (JPG, PNG, PDF - máx. 5MB)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="border border-gray-200 rounded-lg p-2">
            <p className="text-xs text-gray-600 mb-2">Vista previa:</p>
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
          </div>
        )}

        {/* Bank reference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de referencia (opcional)
          </label>
          <input
            type="text"
            value={bankReference}
            onChange={(e) => setBankReference(e.target.value)}
            disabled={uploading}
            placeholder="Ej: 123456789"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Número de transacción o referencia del banco (si lo tienes)
          </p>
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Subir Comprobante
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Una vez subido, tu comprobante será revisado por nuestro equipo.
          Recibirás una confirmación por email cuando se apruebe el pago.
        </p>
      </div>
    </div>
  );
}
