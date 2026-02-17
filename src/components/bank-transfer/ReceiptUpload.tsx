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

      const formData = new FormData();
      formData.append('file', file);
      formData.append('order_id', orderId);
      if (bankReference.trim()) {
        formData.append('bank_reference_number', bankReference.trim());
      }

      const { data, error: uploadError } = await supabase.functions.invoke('upload-bank-receipt', {
        body: formData,
      });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al subir el comprobante');
      }

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
