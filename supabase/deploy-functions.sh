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

# Desplegar create-order
echo "📦 Desplegando create-order..."
supabase functions deploy create-order --no-verify-jwt

if [ $? -eq 0 ]; then
    echo "✅ create-order desplegada correctamente"
else
    echo "❌ Error al desplegar create-order"
    exit 1
fi

echo ""
echo "🎉 ¡Todas las Edge Functions desplegadas exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a Supabase Dashboard → Edge Functions"
echo "2. Habilita 'Public access' en create-order"
echo "3. Configura los secretos en Settings → Edge Functions → Secrets:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
