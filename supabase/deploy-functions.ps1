# Script para desplegar Edge Functions a Supabase (Windows PowerShell)
# Uso: .\deploy-functions.ps1

Write-Host "🚀 Desplegando Edge Functions a Supabase..." -ForegroundColor Cyan
Write-Host ""

# Verificar que Supabase CLI está instalado
if (!(Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Supabase CLI no está instalado" -ForegroundColor Red
    Write-Host "Instálalo con: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Supabase CLI encontrado" -ForegroundColor Green
Write-Host ""

# Verificar que estamos logueados
Write-Host "🔐 Verificando autenticación..." -ForegroundColor Cyan
$null = supabase projects list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No estás autenticado en Supabase" -ForegroundColor Red
    Write-Host "Ejecuta: supabase login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Autenticado correctamente" -ForegroundColor Green
Write-Host ""

# Deploy functions
Write-Host "📦 Desplegando create-order..." -ForegroundColor Cyan
supabase functions deploy create-order --no-verify-jwt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al desplegar create-order" -ForegroundColor Red
    exit 1
}
Write-Host "✅ create-order desplegada" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Desplegando mercadopago-webhook..." -ForegroundColor Cyan
supabase functions deploy mercadopago-webhook --no-verify-jwt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al desplegar mercadopago-webhook" -ForegroundColor Red
    exit 1
}
Write-Host "✅ mercadopago-webhook desplegada" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Desplegando upload-bank-receipt..." -ForegroundColor Cyan
supabase functions deploy upload-bank-receipt --no-verify-jwt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al desplegar upload-bank-receipt" -ForegroundColor Red
    exit 1
}
Write-Host "✅ upload-bank-receipt desplegada" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Desplegando cleanup-expired-carts..." -ForegroundColor Cyan
supabase functions deploy cleanup-expired-carts --no-verify-jwt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al desplegar cleanup-expired-carts" -ForegroundColor Red
    exit 1
}
Write-Host "✅ cleanup-expired-carts desplegada" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 ¡Todas las Edge Functions desplegadas exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ve a Supabase Dashboard → Edge Functions"
Write-Host "2. Habilita 'Public access' en:"
Write-Host "   - create-order"
Write-Host "   - mercadopago-webhook"
Write-Host "   - upload-bank-receipt"
Write-Host "3. Configura los secretos en Settings → Edge Functions → Secrets:"
Write-Host "   - SUPABASE_URL"
Write-Host "   - SUPABASE_SERVICE_ROLE_KEY"
Write-Host "   - MERCADOPAGO_ACCESS_TOKEN"
Write-Host "   - PUBLIC_SITE_URL"
Write-Host "4. Configura el webhook en Mercado Pago Dashboard:"
Write-Host "   URL: https://[tu-proyecto].supabase.co/functions/v1/mercadopago-webhook"
Write-Host "5. Crea el bucket 'payment-receipts' en Storage (privado con RLS)"
Write-Host "6. Configura un cron job para cleanup-expired-carts (cada 30 min)"
Write-Host ""
