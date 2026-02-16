# Configuración de Supabase - Sistema de Pagos

Este directorio contiene las migraciones SQL necesarias para implementar el sistema de pagos con carrito de compras.

## Fase 1: Carrito de Compras

### Pasos para configurar (ejecutar en Supabase Dashboard):

1. Ve a **Supabase Dashboard** > **SQL Editor** > **New query**

2. Copia y pega el contenido de `migrations/001_create_cart_tables.sql`

3. Click en **Run** o presiona `Ctrl + Enter`

4. Verifica que se crearon las tablas:
   - `cart_sessions` - Sesiones de carrito (guest checkout)
   - `cart_items` - Items en cada carrito

5. Verifica los índices y triggers

### Verificación

Ejecuta este SQL para verificar que todo se creó correctamente:

```sql
-- Ver tablas creadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('cart_sessions', 'cart_items');

-- Ver políticas RLS
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('cart_sessions', 'cart_items');
```

## Próximas Fases

### Fase 2: Órdenes y Stock
- Tablas: `orders`, `order_items`, `stock_reservations`
- Modificación: Agregar columnas de stock a `products`

### Fase 3: Mercado Pago
- Tabla: `payments`
- Edge Functions

### Fase 4: Transferencias Bancarias
- Storage bucket: `payment-receipts`
- RPC functions para aprobación

## Notas Importantes

- **RLS (Row Level Security)** está habilitado en todas las tablas
- Las políticas permiten acceso público (guest checkout)
- Los carritos expiran automáticamente después de 7 días
- Se usa `session_id` (UUID en localStorage) para identificar carritos
