# Guía de Instalación Completa - Sistema de Pagos

Esta guía te ayudará a configurar el proyecto completo, incluyendo Supabase, Edge Functions y el sistema de pagos.

## 📋 Requisitos Previos

- Node.js 18+ instalado ([descargar aquí](https://nodejs.org/))
- Cuenta de Supabase ([registrarse gratis](https://supabase.com))
- Git instalado
- Editor de código (recomendado: VS Code)

---

## 🚀 Paso 1: Clonar e Instalar

```bash
# Clonar el repositorio
git clone https://github.com/NR213z/CASAMIENTOS-ESLY.git
cd CASAMIENTOS-ESLY

# Instalar dependencias
npm install
```

---

## 🔑 Paso 2: Configurar Variables de Entorno

### 2.1 Crear archivo .env.local

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.local.example .env.local
```

### 2.2 Obtener credenciales de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Settings** → **API**
3. Copia los valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 2.3 Editar .env.local

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

---

## 🗄️ Paso 3: Configurar Base de Datos (Supabase)

### 3.1 Ejecutar Migraciones SQL

Ve a **Supabase Dashboard** → **SQL Editor** → **New query** y ejecuta cada archivo en orden:

#### Migración 1: Tablas de Carrito

Archivo: `supabase/migrations/001_create_cart_tables.sql`

```sql
-- Copia y pega el contenido completo del archivo
-- Click en "Run" o Ctrl+Enter
```

✅ **Verifica que se crearon:**
- Tabla `cart_sessions`
- Tabla `cart_items`

#### Migración 2: Tablas de Órdenes

Archivo: `supabase/migrations/002_create_order_tables.sql`

```sql
-- Copia y pega el contenido completo del archivo
-- Click en "Run" o Ctrl+Enter
```

✅ **Verifica que se crearon:**
- Tabla `orders`
- Tabla `order_items`
- Tabla `payments`
- Tabla `stock_reservations`

#### Migración 3: Columnas de Stock

Archivo: `supabase/migrations/003_add_stock_to_products.sql`

```sql
-- Copia y pega el contenido completo del archivo
-- Click en "Run" o Ctrl+Enter
```

✅ **Verifica que se agregaron las columnas:**
- `stock_quantity`
- `reserved_quantity`
- `low_stock_threshold`

#### Migración 4: Triggers

Archivo: `supabase/migrations/004_create_triggers.sql`

```sql
-- Copia y pega el contenido completo del archivo
-- Click en "Run" o Ctrl+Enter
```

✅ **Verifica que se crearon:**
- Función `generate_order_number()`
- Función `update_product_reserved_quantity()`
- Función `deduct_stock_on_payment()`
- Función `cleanup_expired_reservations()`

### 3.2 Verificar Instalación de la Base de Datos

Ejecuta este query en SQL Editor:

```sql
-- Ver todas las tablas creadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Deberías ver:
-- cart_items
-- cart_sessions
-- order_items
-- orders
-- payments
-- products
-- stock_reservations
```

---

## ⚡ Paso 4: Instalar y Configurar Supabase CLI

### 4.1 Instalar Supabase CLI

**Windows (PowerShell):**
```powershell
scoop install supabase
```

**macOS/Linux:**
```bash
brew install supabase/tap/supabase
```

**Alternativa (npm global):**
```bash
npm install -g supabase
```

### 4.2 Login en Supabase

```bash
supabase login
```

Esto abrirá tu navegador para autenticarte.

### 4.3 Vincular tu Proyecto

```bash
supabase link --project-ref tu-proyecto-id
```

💡 **Tip:** Encuentra tu project ID en la URL de tu dashboard: `https://supabase.com/dashboard/project/[TU-PROJECT-ID]`

---

## 🔧 Paso 5: Desplegar Edge Functions

### 5.1 Configurar Secretos (Variables de Entorno del Servidor)

En **Supabase Dashboard** → **Settings** → **Edge Functions** → **Secrets**, agrega:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

💡 **El Service Role Key** lo encuentras en **Settings** → **API** → `service_role key` (¡es secreto, nunca lo expongas!)

### 5.2 Desplegar la Edge Function `create-order`

```bash
supabase functions deploy create-order
```

✅ **Verifica el deploy:**
- Ve a **Dashboard** → **Edge Functions**
- Deberías ver `create-order` listado

### 5.3 Habilitar Acceso Público a la Edge Function

En **Dashboard** → **Edge Functions** → `create-order`:
- Click en **Settings**
- Habilita **"Public access"** (para que el frontend pueda llamarla)

---

## 🎨 Paso 6: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173` (o el puerto que Vite elija).

---

## 🧪 Paso 7: Probar el Sistema

### 7.1 Crear Productos de Prueba

1. Ve a `http://localhost:5173/admin/login`
2. Crea una cuenta de admin (primer usuario)
3. Ve a **Dashboard** → **Productos**
4. Agrega algunos productos con:
   - Nombre
   - Descripción
   - Precio
   - Stock (ej: 10 unidades)
   - Imagen (opcional)

### 7.2 Probar el Flujo Completo

1. **Agregar al carrito:**
   - Ve a `/productos`
   - Click en "Agregar al Carrito"
   - Verifica que el badge del carrito se actualice

2. **Ver el carrito:**
   - Click en el ícono del carrito
   - Verifica que los productos aparezcan
   - Prueba cambiar cantidades

3. **Checkout:**
   - Click en "Proceder al Pago"
   - Llena el formulario (nombre, email, teléfono)
   - Selecciona "Transferencia Bancaria"
   - Click en "Confirmar Pedido"

4. **Verificar la orden:**
   - Deberías ver la página de confirmación
   - Nota el número de orden (ej: `ORD-20260215-0001`)

5. **Verificar en la Base de Datos:**
   - Ve a Supabase Dashboard → **Table Editor** → `orders`
   - Deberías ver tu orden con estado `pending_payment`
   - Ve a `order_items` para ver los productos
   - Ve a `stock_reservations` para ver las reservas (15 min)
   - Ve a `products` y verifica que `reserved_quantity` aumentó

---

## 🔍 Troubleshooting (Solución de Problemas)

### Problema: "Missing Supabase environment variables"

**Solución:** Verifica que `.env.local` existe y tiene las variables correctas:
```bash
cat .env.local
```

### Problema: Edge Function no responde

**Soluciones:**
1. Verifica que desplegaste la función: `supabase functions list`
2. Verifica los logs: En Dashboard → Edge Functions → create-order → Logs
3. Verifica que habilitaste acceso público

### Problema: "No se pudo crear la orden" / Error de stock

**Soluciones:**
1. Verifica que el producto tiene stock: `SELECT * FROM products;`
2. Verifica que las migraciones se ejecutaron: `SELECT * FROM stock_reservations;`
3. Revisa los logs de la Edge Function

### Problema: Carrito no persiste

**Soluciones:**
1. Verifica que las tablas `cart_sessions` y `cart_items` existen
2. Abre DevTools → Application → Local Storage → Verifica que existe `cartSessionId`
3. Verifica los errores en la consola del navegador

---

## 📚 Estructura del Proyecto

```
CASAMIENTOS-ESLY/
├── src/
│   ├── components/
│   │   └── cart/
│   │       ├── CartDrawer.tsx       # Panel lateral del carrito
│   │       ├── CartIcon.tsx         # Ícono con badge
│   │       └── CartItemCard.tsx     # Tarjeta de item
│   ├── contexts/
│   │   └── CartContext.tsx          # Estado global del carrito
│   ├── pages/
│   │   ├── Checkout.tsx             # Página de checkout
│   │   ├── OrderConfirmation.tsx    # Confirmación de orden
│   │   └── Products.tsx             # Catálogo de productos
│   └── lib/
│       └── supabase.ts              # Cliente de Supabase + tipos
├── supabase/
│   ├── functions/
│   │   └── create-order/
│   │       └── index.ts             # Edge Function para crear órdenes
│   └── migrations/
│       ├── 001_create_cart_tables.sql
│       ├── 002_create_order_tables.sql
│       ├── 003_add_stock_to_products.sql
│       └── 004_create_triggers.sql
├── .env.local                       # Variables de entorno (NO committear)
├── .env.local.example               # Ejemplo de .env
├── package.json                     # Dependencias del proyecto
└── README.md                        # README principal
```

---

## ✅ Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] Repositorio clonado
- [ ] `npm install` ejecutado sin errores
- [ ] Cuenta de Supabase creada
- [ ] `.env.local` configurado con credenciales correctas
- [ ] Migración 1 (cart_tables) ejecutada ✅
- [ ] Migración 2 (order_tables) ejecutada ✅
- [ ] Migración 3 (stock columns) ejecutada ✅
- [ ] Migración 4 (triggers) ejecutada ✅
- [ ] Supabase CLI instalado
- [ ] Proyecto vinculado con `supabase link`
- [ ] Secretos configurados en Dashboard
- [ ] Edge Function `create-order` desplegada
- [ ] Acceso público habilitado en Edge Function
- [ ] `npm run dev` funciona sin errores
- [ ] Productos de prueba creados
- [ ] Flujo de checkout probado

---

## 🎯 Próximos Pasos (Fases Futuras)

### Fase 3: Mercado Pago (Pendiente)
- [ ] Instalar `@mercadopago/sdk-react`
- [ ] Configurar credenciales de Mercado Pago
- [ ] Crear preference en Edge Function
- [ ] Implementar webhook handler
- [ ] Integrar botón de pago

### Fase 4: Transferencias Bancarias (Pendiente)
- [ ] Crear Storage bucket para comprobantes
- [ ] Edge Function para upload de comprobantes
- [ ] Admin: Componente de revisión
- [ ] RPC functions de aprobación/rechazo

### Fase 5: Mejoras Admin (Pendiente)
- [ ] Dashboard de pedidos con filtros
- [ ] Cambio de estados de órdenes
- [ ] Alertas de stock bajo
- [ ] Job de limpieza automática

---

## 📞 Soporte

Si tienes problemas con la instalación:

1. Revisa la sección **Troubleshooting** arriba
2. Verifica los logs de Supabase: Dashboard → Logs
3. Revisa la consola del navegador (F12) para errores de frontend
4. Verifica los logs de Edge Functions en el Dashboard

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu sistema de pagos está funcionando al 100%.

Ahora puedes:
- ✅ Agregar productos al carrito
- ✅ Crear órdenes de compra
- ✅ Reservar stock automáticamente
- ✅ Ver confirmación de órdenes

**Estado actual:** Fase 2 completa (Checkout y Órdenes)
**Próximo:** Fase 3 (Integración con Mercado Pago)
