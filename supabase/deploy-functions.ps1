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

# Desplegar create-order
Write-Host "📦 Desplegando create-order..." -ForegroundColor Cyan
supabase functions deploy create-order --no-verify-jwt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ create-order desplegada correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al desplegar create-order" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 ¡Todas las Edge Functions desplegadas exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ve a Supabase Dashboard → Edge Functions"
Write-Host "2. Habilita 'Public access' en create-order"
Write-Host "3. Configura los secretos en Settings → Edge Functions → Secrets:"
Write-Host "   - SUPABASE_URL"
Write-Host "   - SUPABASE_SERVICE_ROLE_KEY"
Write-Host ""
