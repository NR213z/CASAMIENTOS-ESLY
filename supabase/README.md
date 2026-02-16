# Configuración de Supabase - Sistema de Pagos

Este directorio contiene las migraciones SQL y Edge Functions para el sistema de pagos completo.

## 📁 Estructura

```
supabase/
├── migrations/           # Migraciones SQL (ejecutar en orden)
│   ├── 001_create_cart_tables.sql
│   ├── 002_create_order_tables.sql
│   ├── 003_add_stock_to_products.sql
│   └── 004_create_triggers.sql
├── functions/           # Edge Functions (serverless)
│   └── create-order/    # Crear órdenes y reservar stock
├── deploy-functions.sh  # Script de deploy (Linux/Mac)
└── deploy-functions.ps1 # Script de deploy (Windows)
```

---

## 🚀 Guía de Instalación Rápida

### 1️⃣ Ejecutar Migraciones SQL

Ve a **Supabase Dashboard** → **SQL Editor** → **New query**

Ejecuta cada archivo **en orden**:

#### ✅ Migración 1: Carrito de Compras
```sql
-- Copia y pega: migrations/001_create_cart_tables.sql
-- Crea: cart_sessions, cart_items
```

#### ✅ Migración 2: Sistema de Órdenes
```sql
-- Copia y pega: migrations/002_create_order_tables.sql
-- Crea: orders, order_items, payments, stock_reservations
```

#### ✅ Migración 3: Gestión de Stock
```sql
-- Copia y pega: migrations/003_add_stock_to_products.sql
-- Agrega columnas: stock_quantity, reserved_quantity, low_stock_threshold
```

#### ✅ Migración 4: Triggers Automáticos
```sql
-- Copia y pega: migrations/004_create_triggers.sql
-- Crea: Triggers para números de orden, reservas y stock
```

### 2️⃣ Verificar Instalación

Ejecuta este SQL para verificar:

```sql
-- Ver todas las tablas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Deberías ver:
-- ✓ cart_items
-- ✓ cart_sessions
-- ✓ order_items
-- ✓ orders
-- ✓ payments
-- ✓ products
-- ✓ stock_reservations
```

### 3️⃣ Desplegar Edge Functions

#### Opción A: Script Automático

**Linux/Mac:**
```bash
cd supabase
chmod +x deploy-functions.sh
./deploy-functions.sh
```

**Windows PowerShell:**
```powershell
cd supabase
.\deploy-functions.ps1
```

#### Opción B: Manual

```bash
# Login (solo primera vez)
supabase login

# Vincular proyecto
supabase link --project-ref tu-proyecto-id

# Desplegar todas las funciones
supabase functions deploy create-order --no-verify-jwt
supabase functions deploy mercadopago-webhook --no-verify-jwt
supabase functions deploy upload-bank-receipt --no-verify-jwt
supabase functions deploy cleanup-expired-carts --no-verify-jwt
```

### 4️⃣ Configurar Secretos

En **Dashboard** → **Settings** → **Edge Functions** → **Secrets**:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_de_mercadopago
PUBLIC_SITE_URL=https://tu-sitio.com (o http://localhost:5173 para desarrollo)
```

### 5️⃣ Habilitar Acceso Público

En **Dashboard** → **Edge Functions**, habilita "Public access" en:
- ✅ `create-order`
- ✅ `mercadopago-webhook`
- ✅ `upload-bank-receipt`

(cleanup-expired-carts NO necesita acceso público - es solo para cron jobs)

---

## 📊 Fase 1: Carrito de Compras ✅ COMPLETADO

### Tablas Creadas

- `cart_sessions` - Sesiones de carrito (guest checkout)
- `cart_items` - Items en cada carrito

### Verificación

```sql
-- Ver políticas RLS
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('cart_sessions', 'cart_items');
```

---

## 📊 Fase 2: Órdenes y Stock ✅ COMPLETADO

### Tablas Creadas

- `orders` - Pedidos maestros (info cliente, totales, estado)
- `order_items` - Línea de items (snapshot al momento de compra)
- `payments` - Transacciones (Mercado Pago y transferencias)
- `stock_reservations` - Reservas temporales (15 minutos)

### Triggers Automáticos

- ✅ Generación de número de orden (`ORD-YYYYMMDD-0001`)
- ✅ Actualización de `reserved_quantity` al crear reservas
- ✅ Deducción de `stock_quantity` al confirmar pago
- ✅ Función de limpieza de reservas expiradas

### Edge Functions

- ✅ `create-order` - Validar stock, crear orden, reservar stock

### Verificación

```sql
-- Ver funciones trigger
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';

-- Ver triggers
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

---

## ✅ Fase 3: Mercado Pago - COMPLETADO

### SDK y Edge Functions

- ✅ SDK `@mercadopago/sdk-react` instalado
- ✅ Edge Function `create-order` actualizada para crear preferences
- ✅ Edge Function `mercadopago-webhook` - Recibir notificaciones de pago
- ✅ Botón de pago integrado en OrderConfirmation

### Configuración Requerida

1. **Mercado Pago Dashboard:**
   - Crear cuenta y obtener credenciales de prueba/producción
   - Configurar webhook URL: `https://[tu-proyecto].supabase.co/functions/v1/mercadopago-webhook`

2. **Variables de Entorno:**
   - Frontend: `VITE_MERCADOPAGO_PUBLIC_KEY`
   - Backend (Secrets): `MERCADOPAGO_ACCESS_TOKEN`

---

## ✅ Fase 4: Transferencias Bancarias - COMPLETADO

### Storage y Edge Functions

- ✅ Edge Function `upload-bank-receipt` - Subir comprobantes
- ✅ Componente `ReceiptUpload` - UI para subir comprobantes
- ✅ Migración `005_create_rpc_functions.sql` - Aprobar/Rechazar pagos
- ✅ Componente admin `OrdersManagement` - Gestión de pedidos
- ✅ Componente admin `ReceiptViewer` - Revisión y aprobación

### Configuración Requerida

1. **Storage Bucket:**
   ```sql
   -- Crear bucket en Dashboard → Storage
   Nombre: payment-receipts
   Tipo: Privado
   Allowed MIME types: image/jpeg, image/png, image/webp, application/pdf
   Max file size: 5MB
   ```

2. **RLS Policies para Storage:**
   ```sql
   -- Permitir upload público
   CREATE POLICY "Anyone can upload receipts"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'payment-receipts');

   -- Solo admins pueden leer
   CREATE POLICY "Admins can read receipts"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'payment-receipts' AND auth.role() = 'authenticated');
   ```

---

## ✅ Fase 5: Mejoras Admin - COMPLETADO

### Componentes y Edge Functions

- ✅ Edge Function `cleanup-expired-carts` - Limpieza automática
- ✅ Componente `LowStockAlert` - Alertas de stock bajo en tiempo real
- ✅ Dashboard de pedidos con filtros avanzados
- ✅ Búsqueda por orden/email/teléfono
- ✅ Subscripción realtime a cambios de stock

### Configuración Requerida

1. **Cron Job (Opcional pero Recomendado):**

   Configurar en un servicio externo (ej: cron-job.org) para llamar cada 30 minutos:
   ```
   URL: https://[tu-proyecto].supabase.co/functions/v1/cleanup-expired-carts
   Method: POST
   Headers:
     Authorization: Bearer [SUPABASE_ANON_KEY]
   ```

   O usar Supabase Cron (si está disponible en tu plan):
   ```sql
   -- En pg_cron extension
   SELECT cron.schedule(
     'cleanup-expired-carts-job',
     '*/30 * * * *', -- Cada 30 minutos
     $$
     SELECT net.http_post(
       url := 'https://[tu-proyecto].supabase.co/functions/v1/cleanup-expired-carts',
       headers := '{"Authorization": "Bearer [ANON_KEY]"}'::jsonb
     );
     $$
   );
   ```

---

## 📝 Notas Importantes

### Seguridad

- **RLS (Row Level Security)** está habilitado en todas las tablas
- Las políticas permiten acceso público (guest checkout)
- Los precios se validan server-side (Edge Function)
- Stock se valida con row locking en PostgreSQL

### Funcionalidad

- Los carritos expiran automáticamente después de 7 días
- Las reservas de stock expiran después de 15 minutos
- Se usa `session_id` (UUID en localStorage) para identificar carritos
- Los order_items guardan snapshot de productos (precio al momento de compra)

### Mantenimiento

Para limpiar reservas expiradas manualmente:

```sql
SELECT cleanup_expired_reservations();
```

---

## 🆘 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solución:** Verifica secretos en Dashboard → Edge Functions → Secrets

### Error: Edge Function no responde

**Solución:**
1. Verifica que está desplegada: Dashboard → Edge Functions
2. Verifica que tiene acceso público habilitado
3. Revisa los logs en la función

### Error: "Stock insuficiente" pero hay stock

**Solución:**
```sql
-- Verificar stock real vs reservado
SELECT id, name, stock_quantity, reserved_quantity,
       (stock_quantity - reserved_quantity) as available
FROM products;

-- Si hay reservas viejas, limpiarlas
SELECT cleanup_expired_reservations();
```

---

## 📚 Documentación Adicional

Para una guía completa de instalación, ver: **[INSTALL.md](../INSTALL.md)** en la raíz del proyecto.
