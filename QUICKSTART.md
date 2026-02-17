# 🚀 Quick Start - 5 Minutos

Guía ultra-rápida para poner el proyecto en marcha.

## ⚡ Instalación Express

```bash
# 1. Clonar e instalar
git clone https://github.com/NR213z/CASAMIENTOS-ESLY.git
cd CASAMIENTOS-ESLY
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 3. Verificar instalación
npm run verify
```

---

## 🗄️ Setup de Supabase (5 minutos)

### Paso 1: Crear Proyecto Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Click en "New project"
3. Anota la URL y anon key

### Paso 2: Ejecutar Migraciones SQL

Ve a **Dashboard** → **SQL Editor** y ejecuta estos 4 archivos **en orden**:

1. ✅ `supabase/migrations/001_create_cart_tables.sql`
2. ✅ `supabase/migrations/002_create_order_tables.sql`
3. ✅ `supabase/migrations/003_add_stock_to_products.sql`
4. ✅ `supabase/migrations/004_create_triggers.sql`

💡 **Tip:** Copia y pega cada archivo completo, click en "Run"

### Paso 3: Desplegar Edge Function (Opcional pero recomendado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login y vincular
supabase login
supabase link --project-ref TU-PROJECT-ID

# Desplegar
supabase functions deploy create-order --no-verify-jwt
```

**Configurar en Dashboard:**
- **Settings** → **Edge Functions** → **Secrets**:
  - `SUPABASE_URL` = Tu project URL
  - `SUPABASE_SERVICE_ROLE_KEY` = Tu service role key (Settings → API)
- **Edge Functions** → `create-order` → **Settings**:
  - Habilitar "Public access" ✅

---

## 🎮 Iniciar el Proyecto

```bash
npm run dev
```

Abre: `http://localhost:5173`

---

## ✅ Verificar que Funciona

### 1. Crear Admin (Primera vez)

1. Ve a `/admin/login`
2. Registra una cuenta (primer usuario = admin)

### 2. Crear Productos

1. Login al admin
2. Dashboard → Productos → Agregar Producto
3. Crea 2-3 productos con:
   - Nombre, precio, stock (ej: 10)
   - Imagen opcional

### 3. Probar Checkout

1. Ve a `/productos`
2. Click "Agregar al Carrito" en un producto
3. Click en ícono del carrito (arriba derecha)
4. Click "Proceder al Pago"
5. Llena el formulario
6. Selecciona "Transferencia Bancaria"
7. Click "Confirmar Pedido"
8. ✅ Deberías ver la página de confirmación

### 4. Verificar en Base de Datos

En Supabase Dashboard → Table Editor:

- ✅ `orders` → Debe tener tu orden
- ✅ `order_items` → Debe tener los productos
- ✅ `stock_reservations` → Debe tener una reserva (15 min)
- ✅ `products` → `reserved_quantity` debe haber aumentado

---

## 🆘 Problemas Comunes

### "Missing Supabase environment variables"

```bash
# Verifica que .env.local existe y tiene valores reales
cat .env.local
```

### "Table does not exist"

Ejecutaste las migraciones? Ve a Supabase Dashboard → SQL Editor

### Edge Function no responde

1. Verifica que la desplegaste: `supabase functions list`
2. Verifica que tiene acceso público en Dashboard
3. Revisa los logs en Dashboard → Edge Functions → create-order

### Carrito no funciona

1. Abre DevTools (F12) → Console
2. Busca errores en rojo
3. Verifica que las tablas `cart_sessions` y `cart_items` existen

---

## 📚 Documentación Completa

- **[INSTALL.md](./INSTALL.md)** - Guía de instalación detallada
- **[supabase/README.md](./supabase/README.md)** - Info de migraciones y Edge Functions
- **[README.md](./README.md)** - Info general del proyecto

---

## 🎯 Próximos Pasos

Una vez que todo funciona:

1. **Personalizar productos:** Agrega tus productos reales desde el admin
2. **Configurar datos bancarios:** Edita `OrderConfirmation.tsx` con tus datos reales
3. **Fase 3:** Integrar Mercado Pago (ver plan en `.claude/plans/`)
4. **Fase 4:** Sistema de upload de comprobantes bancarios

---

## 💡 Comandos Útiles

```bash
# Verificar instalación
npm run verify

# Iniciar servidor dev
npm run dev

# Build producción
npm run build

# Ver logs de Supabase (si CLI está instalado)
supabase functions logs create-order

# Limpiar reservas expiradas (en Supabase SQL Editor)
SELECT cleanup_expired_reservations();
```

---

## ✨ ¡Listo para Producción!

Cuando estés listo para desplegar:

1. Ejecuta `npm run build`
2. Sube a tu hosting (Vercel, Netlify, etc.)
3. Configura las variables de entorno en el hosting
4. ¡Disfruta tu tienda online! 🎉
