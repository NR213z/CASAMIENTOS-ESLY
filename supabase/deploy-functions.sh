#!/bin/bash

# Script para desplegar Edge Functions a Supabase
# Uso: ./deploy-functions.sh

echo "🚀 Desplegando Edge Functions a Supabase..."
echo ""

# Verificar que Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI no está instalado"
    echo "Instálalo con: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI encontrado"
echo ""

# Verificar que estamos logueados
echo "🔐 Verificando autenticación..."
if ! supabase projects list &> /dev/null; then
    echo "❌ No estás autenticado en Supabase"
    echo "Ejecuta: supabase login"
    exit 1
fi

echo "✅ Autenticado correctamente"
echo ""

# Deploy functions
echo "📦 Desplegando create-order..."
supabase functions deploy create-order --no-verify-jwt
if [ $? -ne 0 ]; then
    echo "❌ Error al desplegar create-order"
    exit 1
fi
echo "✅ create-order desplegada"

echo ""
echo "📦 Desplegando mercadopago-webhook..."
supabase functions deploy mercadopago-webhook --no-verify-jwt
if [ $? -ne 0 ]; then
    echo "❌ Error al desplegar mercadopago-webhook"
    exit 1
fi
echo "✅ mercadopago-webhook desplegada"

echo ""
echo "📦 Desplegando upload-bank-receipt..."
supabase functions deploy upload-bank-receipt --no-verify-jwt
if [ $? -ne 0 ]; then
    echo "❌ Error al desplegar upload-bank-receipt"
    exit 1
fi
echo "✅ upload-bank-receipt desplegada"

echo ""
echo "📦 Desplegando cleanup-expired-carts..."
supabase functions deploy cleanup-expired-carts --no-verify-jwt
if [ $? -ne 0 ]; then
    echo "❌ Error al desplegar cleanup-expired-carts"
    exit 1
fi
echo "✅ cleanup-expired-carts desplegada"

echo ""
echo "🎉 ¡Todas las Edge Functions desplegadas exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a Supabase Dashboard → Edge Functions"
echo "2. Habilita 'Public access' en:"
echo "   - create-order"
echo "   - mercadopago-webhook"
echo "   - upload-bank-receipt"
echo "3. Configura los secretos en Settings → Edge Functions → Secrets:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - MERCADOPAGO_ACCESS_TOKEN"
echo "   - PUBLIC_SITE_URL"
echo "4. Configura el webhook en Mercado Pago Dashboard:"
echo "   URL: https://[tu-proyecto].supabase.co/functions/v1/mercadopago-webhook"
echo "5. Crea el bucket 'payment-receipts' en Storage (privado con RLS)"
echo "6. Configura un cron job para cleanup-expired-carts (cada 30 min)"
echo ""
