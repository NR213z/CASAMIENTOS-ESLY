# 💍 Esly Casamientos - E-Commerce Platform

Sistema completo de e-commerce para productos de bodas y eventos, con carrito de compras, checkout y sistema de pagos integrado (Mercado Pago y transferencias bancarias).

![Status](https://img.shields.io/badge/Status-Phase%202%20Complete-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

---

## 🚀 Quick Start

```bash
# Clonar e instalar
git clone https://github.com/NR213z/CASAMIENTOS-ESLY.git
cd CASAMIENTOS-ESLY
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus credenciales de Supabase

# Verificar instalación
npm run verify

# Iniciar servidor de desarrollo
npm run dev
```

📖 **[Ver guía completa de inicio rápido →](./QUICKSTART.md)**

---

## ✨ Features Implementadas

### ✅ Fase 1: Carrito de Compras
- Carrito persistente en base de datos
- Session ID para guest checkout
- Agregar/remover/actualizar cantidades
- Badge animado con contador
- Panel lateral con resumen

### ✅ Fase 2: Checkout y Órdenes
- Formulario validado (react-hook-form + zod)
- Selección de método de pago
- Creación de órdenes con Edge Functions
- Sistema de reserva de stock (15 minutos)
- Prevención de sobreventa
- Validación server-side de precios
- Página de confirmación

### 🔜 Próximamente
- **Fase 3:** Integración completa con Mercado Pago
- **Fase 4:** Upload de comprobantes bancarios con revisión admin
- **Fase 5:** Dashboard admin completo con gestión de pedidos

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Routing
- **React Hook Form + Zod** - Forms & validation
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Edge Functions (Deno)
  - Storage (para comprobantes - Fase 4)
- **Deno** - Runtime para Edge Functions

### Estado del Proyecto
- ✅ Producción-ready: Catálogo, Carrito, Checkout
- 🔄 En desarrollo: Pasarelas de pago
- 📋 Planificado: Admin dashboard avanzado

---

## 📁 Estructura del Proyecto

```
CASAMIENTOS-ESLY/
├── src/
│   ├── components/
│   │   ├── cart/              # Componentes del carrito
│   │   ├── admin/             # Panel de administración
│   │   └── ...
│   ├── contexts/
│   │   ├── CartContext.tsx    # Estado global del carrito
│   │   └── AuthContext.tsx    # Autenticación
│   ├── pages/
│   │   ├── Index.tsx          # Landing page
│   │   ├── Products.tsx       # Catálogo
│   │   ├── Checkout.tsx       # Checkout ✨
│   │   ├── OrderConfirmation.tsx  # Confirmación ✨
│   │   └── AdminDashboard.tsx # Admin
│   └── lib/
│       └── supabase.ts        # Cliente + tipos
├── supabase/
│   ├── migrations/            # SQL migrations (4 archivos)
│   ├── functions/
│   │   └── create-order/      # Edge Function de órdenes ✨
│   ├── deploy-functions.sh    # Script de deploy
│   └── README.md              # Docs de Supabase
├── scripts/
│   └── verify-setup.js        # Verificación automática ✨
├── INSTALL.md                 # Guía de instalación completa ✨
├── QUICKSTART.md              # Inicio rápido (5 min) ✨
├── SETUP_STATUS.md            # Estado del proyecto ✨
└── README.md                  # Este archivo

✨ = Archivos nuevos en Fase 2
```

---

## 📖 Documentación

| Documento | Descripción |
|-----------|-------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | Inicio rápido en 5 minutos |
| **[INSTALL.md](./INSTALL.md)** | Guía completa de instalación |
| **[SETUP_STATUS.md](./SETUP_STATUS.md)** | Estado actual del proyecto |
| **[supabase/README.md](./supabase/README.md)** | Migraciones y Edge Functions |

---

## 🗄️ Base de Datos

### Tablas (7)
- `products` - Catálogo de productos
- `cart_sessions` - Sesiones de carrito
- `cart_items` - Items del carrito
- `orders` - Órdenes maestras
- `order_items` - Línea de items (snapshot)
- `payments` - Transacciones de pago
- `stock_reservations` - Reservas temporales

### Triggers Automáticos
- Generación de números de orden
- Gestión de stock reservado
- Deducción automática al pagar

### Edge Functions
- `create-order` - Crear orden con validaciones

📊 **[Ver esquema completo →](./SETUP_STATUS.md#-base-de-datos---estado-actual)**

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (puerto 5173)
npm run build            # Build de producción
npm run preview          # Preview del build

# Testing y Verificación
npm run verify           # Verificar instalación completa ✨
npm test                 # Ejecutar tests
npm run lint             # Linter

# Supabase (requiere CLI)
cd supabase
./deploy-functions.sh    # Deploy Edge Functions (Linux/Mac)
.\deploy-functions.ps1   # Deploy Edge Functions (Windows)
```

---

## ⚙️ Configuración

### Variables de Entorno

Crea `.env.local` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### Supabase Setup

1. **Ejecutar migraciones SQL** (en orden):
   - `001_create_cart_tables.sql`
   - `002_create_order_tables.sql`
   - `003_add_stock_to_products.sql`
   - `004_create_triggers.sql`

2. **Desplegar Edge Functions:**
   ```bash
   supabase functions deploy create-order
   ```

3. **Configurar secretos:**
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

📖 **[Ver guía detallada →](./INSTALL.md)**

---

## 🧪 Testing

### Probar el Flujo Completo

1. **Crear productos:**
   - Login en `/admin/login`
   - Agregar productos con stock

2. **Carrito:**
   - Ir a `/productos`
   - Agregar productos al carrito
   - Verificar badge actualizado

3. **Checkout:**
   - Click en carrito
   - "Proceder al Pago"
   - Llenar formulario
   - Confirmar orden

4. **Verificar en BD:**
   ```sql
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM order_items WHERE order_id = 'tu_order_id';
   SELECT * FROM stock_reservations;
   ```

---

## 🔐 Seguridad

- ✅ Row Level Security (RLS) habilitado
- ✅ Validación de precios server-side
- ✅ Prevención de race conditions (row locking)
- ✅ Guest checkout seguro con session IDs
- ✅ CORS configurado en Edge Functions

---

## 📊 Estado del Proyecto

| Fase | Estado | Progreso |
|------|--------|----------|
| Fase 1: Carrito | ✅ Completo | 100% |
| Fase 2: Checkout | ✅ Completo | 100% |
| Fase 3: Mercado Pago | 🔄 Pendiente | 0% |
| Fase 4: Transferencias | 🔄 Pendiente | 0% |
| Fase 5: Admin | 🔄 Pendiente | 0% |

**Progreso total:** 40% (2/5 fases)

📊 **[Ver detalles completos →](./SETUP_STATUS.md)**

---

## 🤝 Contribuir

Este es un proyecto privado. Para cambios:

1. Crear un branch: `git checkout -b feature/nueva-funcionalidad`
2. Commit cambios: `git commit -m 'Add nueva funcionalidad'`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request

---

## 📝 Roadmap

### Fase 3: Mercado Pago (Próximo)
- [ ] Instalar SDK de Mercado Pago
- [ ] Crear preference en Edge Function
- [ ] Implementar webhook handler
- [ ] Integrar botón de pago
- [ ] Testing con tarjetas de prueba

### Fase 4: Transferencias Bancarias
- [ ] Storage bucket para comprobantes
- [ ] Upload de comprobantes
- [ ] Dashboard de revisión admin
- [ ] Aprobación/rechazo de pagos

### Fase 5: Mejoras Admin
- [ ] Dashboard de pedidos completo
- [ ] Filtros y búsqueda avanzada
- [ ] Gestión de estados
- [ ] Alertas y notificaciones
- [ ] Job de limpieza automática

---

## 📞 Soporte

Para problemas de instalación:

1. Ejecuta `npm run verify` para diagnóstico
2. Revisa [INSTALL.md](./INSTALL.md) - Troubleshooting
3. Verifica logs de Supabase Dashboard

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

---

## 🎉 Créditos

Desarrollado con:
- ❤️ React + TypeScript
- ⚡ Supabase
- 🎨 Tailwind CSS
- 🤖 Claude Sonnet 4.5

---

**Última actualización:** Febrero 2026
**Versión:** 2.0.0 (Fase 2 completa)
