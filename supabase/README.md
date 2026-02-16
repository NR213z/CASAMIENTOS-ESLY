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

# Desplegar función
supabase functions deploy create-order --no-verify-jwt
```

### 4️⃣ Configurar Secretos

En **Dashboard** → **Settings** → **Edge Functions** → **Secrets**:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 5️⃣ Habilitar Acceso Público

En **Dashboard** → **Edge Functions** → `create-order` → **Settings**:
- ✅ Habilita "Public access"

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

## 🔜 Próximas Fases

### Fase 3: Mercado Pago (Pendiente)
- [ ] SDK de Mercado Pago
- [ ] Edge Function: `mercadopago-webhook`
- [ ] Creación de preference
- [ ] Botón de pago integrado

### Fase 4: Transferencias Bancarias (Pendiente)
- [ ] Storage bucket: `payment-receipts`
- [ ] Edge Function: `upload-bank-receipt`
- [ ] Componente admin de revisión
- [ ] RPC functions: `approve_bank_transfer`, `reject_bank_transfer`

### Fase 5: Mejoras Admin (Pendiente)
- [ ] Dashboard de pedidos con filtros
- [ ] Cambio de estados
- [ ] Alertas de stock bajo
- [ ] Job: `cleanup-expired-carts`

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
