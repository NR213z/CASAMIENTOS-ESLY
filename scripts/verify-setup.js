#!/usr/bin/env node

/**
 * Script de verificación para comprobar que todo está instalado correctamente
 * Uso: node scripts/verify-setup.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`)
};

let errorCount = 0;
let warningCount = 0;

// Verificar archivo .env.local
function checkEnvFile() {
  log.section('📋 Verificando Variables de Entorno');

  const envPath = path.join(__dirname, '..', '.env.local');

  if (!fs.existsSync(envPath)) {
    log.error('.env.local no existe');
    log.info('Copia .env.local.example a .env.local y configura las variables');
    errorCount++;
    return null;
  }

  log.success('.env.local encontrado');

  // Leer variables
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  // Verificar variables requeridas
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  let allPresent = true;

  required.forEach(varName => {
    if (!envVars[varName] || envVars[varName].includes('your_') || envVars[varName].includes('_here')) {
      log.error(`${varName} no está configurada o tiene valor por defecto`);
      errorCount++;
      allPresent = false;
    } else {
      log.success(`${varName} configurada`);
    }
  });

  return allPresent ? envVars : null;
}

// Verificar conexión a Supabase
async function checkSupabaseConnection(envVars) {
  log.section('🔌 Verificando Conexión a Supabase');

  if (!envVars) {
    log.error('No se puede verificar conexión sin variables de entorno');
    errorCount++;
    return null;
  }

  try {
    const supabase = createClient(
      envVars.VITE_SUPABASE_URL,
      envVars.VITE_SUPABASE_ANON_KEY
    );

    // Test connection
    const { error } = await supabase.from('products').select('count').limit(1);

    if (error) {
      log.error(`Error de conexión: ${error.message}`);
      errorCount++;
      return null;
    }

    log.success('Conectado a Supabase correctamente');
    return supabase;
  } catch (error) {
    log.error(`Error al conectar: ${error.message}`);
    errorCount++;
    return null;
  }
}

// Verificar tablas de la base de datos
async function checkDatabaseTables(supabase) {
  log.section('🗄️  Verificando Tablas de la Base de Datos');

  if (!supabase) {
    log.error('No se puede verificar tablas sin conexión a Supabase');
    errorCount++;
    return;
  }

  const requiredTables = [
    'products',
    'cart_sessions',
    'cart_items',
    'orders',
    'order_items',
    'payments',
    'stock_reservations'
  ];

  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1);

      if (error) {
        log.error(`Tabla '${table}' no existe o no es accesible`);
        errorCount++;
      } else {
        log.success(`Tabla '${table}' existe`);
      }
    } catch (error) {
      log.error(`Error al verificar tabla '${table}': ${error.message}`);
      errorCount++;
    }
  }
}

// Verificar columnas de stock en products
async function checkStockColumns(supabase) {
  log.section('📊 Verificando Columnas de Stock');

  if (!supabase) {
    log.error('No se puede verificar columnas sin conexión a Supabase');
    errorCount++;
    return;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, stock_quantity, reserved_quantity, low_stock_threshold')
      .limit(1);

    if (error) {
      log.error('Columnas de stock no existen en products');
      log.info('Ejecuta la migración: 003_add_stock_to_products.sql');
      errorCount++;
      return;
    }

    log.success('Columnas de stock existen en products');

    // Verificar si hay productos con stock
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count');

    if (!productsError && products) {
      log.info(`Productos en la base de datos: ${products.length || 0}`);

      if (products.length === 0) {
        log.warning('No hay productos creados. Crea algunos desde el admin dashboard');
        warningCount++;
      }
    }
  } catch (error) {
    log.error(`Error al verificar columnas: ${error.message}`);
    errorCount++;
  }
}

// Verificar Edge Functions
async function checkEdgeFunctions(supabase) {
  log.section('⚡ Verificando Edge Functions');

  if (!supabase) {
    log.error('No se puede verificar Edge Functions sin conexión a Supabase');
    errorCount++;
    return;
  }

  try {
    // Intentar invocar la función (debería fallar por falta de datos, pero nos dice que existe)
    const { error } = await supabase.functions.invoke('create-order', {
      body: { test: true }
    });

    // Si hay error 400, la función existe pero rechazó los datos (esperado)
    // Si hay error 404, la función no existe
    if (error && error.message.includes('404')) {
      log.error('Edge Function "create-order" no está desplegada');
      log.info('Ejecuta: supabase functions deploy create-order');
      errorCount++;
    } else {
      log.success('Edge Function "create-order" está desplegada');
    }
  } catch (error) {
    log.warning('No se pudo verificar Edge Functions (esto es normal en desarrollo local)');
    warningCount++;
  }
}

// Verificar dependencias de npm
function checkNpmDependencies() {
  log.section('📦 Verificando Dependencias de npm');

  const packageJsonPath = path.join(__dirname, '..', 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    log.error('package.json no encontrado');
    errorCount++;
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  const requiredDeps = [
    '@supabase/supabase-js',
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
    'lucide-react'
  ];

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      log.success(`${dep} instalado (v${packageJson.dependencies[dep]})`);
    } else {
      log.error(`${dep} no está instalado`);
      log.info('Ejecuta: npm install');
      errorCount++;
    }
  });

  // Verificar node_modules
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log.error('node_modules no existe');
    log.info('Ejecuta: npm install');
    errorCount++;
  } else {
    log.success('node_modules existe');
  }
}

// Main
async function main() {
  console.log(`
${colors.bold}${colors.cyan}╔════════════════════════════════════════════════╗
║  Verificación de Instalación - Sistema Pagos  ║
╚════════════════════════════════════════════════╝${colors.reset}
`);

  // 1. Verificar dependencias
  checkNpmDependencies();

  // 2. Verificar .env
  const envVars = checkEnvFile();

  // 3. Verificar conexión
  const supabase = await checkSupabaseConnection(envVars);

  // 4. Verificar tablas
  await checkDatabaseTables(supabase);

  // 5. Verificar columnas de stock
  await checkStockColumns(supabase);

  // 6. Verificar Edge Functions
  await checkEdgeFunctions(supabase);

  // Resumen
  console.log(`
${colors.bold}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}
`);

  if (errorCount === 0 && warningCount === 0) {
    log.success(`${colors.bold}¡TODO ESTÁ CONFIGURADO CORRECTAMENTE! 🎉${colors.reset}`);
    console.log('\nPuedes iniciar el servidor con: npm run dev\n');
    process.exit(0);
  } else {
    if (errorCount > 0) {
      log.error(`${colors.bold}Se encontraron ${errorCount} error(es) crítico(s)${colors.reset}`);
    }
    if (warningCount > 0) {
      log.warning(`${colors.bold}Se encontraron ${warningCount} advertencia(s)${colors.reset}`);
    }

    console.log('\nRevisa los mensajes arriba y corrige los problemas.');
    console.log('Consulta INSTALL.md para más detalles.\n');

    process.exit(errorCount > 0 ? 1 : 0);
  }
}

main().catch(error => {
  log.error(`Error inesperado: ${error.message}`);
  process.exit(1);
});
