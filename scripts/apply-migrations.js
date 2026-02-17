#!/usr/bin/env node

/**
 * Script para aplicar todas las migraciones SQL a Supabase
 *
 * Uso: node scripts/apply-migrations.js
 *
 * Requisitos: .env.local configurado con SUPABASE_URL y SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
dotenv.config({ path: join(projectRoot, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar configurados en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrations = [
  '001_create_cart_tables.sql',
  '002_create_order_tables.sql',
  '003_add_stock_to_products.sql',
  '004_create_triggers.sql',
  '005_create_rpc_functions.sql'
];

async function applyMigrations() {
  console.log('\n🚀 Iniciando aplicación de migraciones...\n');

  for (const migration of migrations) {
    console.log(`📄 Aplicando migración: ${migration}`);

    try {
      const migrationPath = join(projectRoot, 'supabase', 'migrations', migration);
      const sql = readFileSync(migrationPath, 'utf8');

      // Note: The Supabase JS client doesn't support executing raw SQL directly
      // We need to use the REST API or pg driver
      console.log(`⚠️  No se puede ejecutar SQL directamente con el cliente JS de Supabase`);
      console.log(`   Debes ejecutar esta migración manualmente en el SQL Editor de Supabase Dashboard`);
      console.log(`   O usar el Supabase CLI: supabase db push\n`);

    } catch (error) {
      console.error(`❌ Error al leer ${migration}:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n⚠️  INSTRUCCIONES:\n');
  console.log('Las migraciones no se pueden aplicar automáticamente con el cliente JS.');
  console.log('Por favor, sigue uno de estos métodos:\n');
  console.log('Opción 1 - Supabase Dashboard (Recomendado):');
  console.log('  1. Ve a https://supabase.com/dashboard');
  console.log('  2. Abre tu proyecto');
  console.log('  3. Ve a "SQL Editor"');
  console.log('  4. Copia y pega el contenido de: supabase/apply-all-migrations.sql');
  console.log('  5. Click en "Run" o presiona Ctrl+Enter\n');
  console.log('Opción 2 - Supabase CLI:');
  console.log('  1. Instala Supabase CLI: npm install -g supabase');
  console.log('  2. Ejecuta: supabase db push --project-ref tu-proyecto\n');
  console.log('Opción 3 - Aplicar individualmente:');
  migrations.forEach((m, i) => {
    console.log(`  ${i + 1}. Ejecuta: supabase/migrations/${m}`);
  });
  console.log('\n✅ Después de aplicar las migraciones, ejecuta: npm run verify\n');
}

applyMigrations();
