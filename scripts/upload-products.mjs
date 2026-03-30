import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = 'https://htjvkigbmuxomsdppdrk.supabase.co';
const SUPABASE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // Replace with your service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IMAGES_DIR = 'E:\\CASAMIENTOS-ESLY\\Images\\Productos';

// Product data from Excel with image file mappings
const products = [
  {
    name: "Ramo de novia con rosas rosadas con tul",
    description: "Descubrí la delicadeza y el encanto de este ramo de novia en tonos rosados, un diseño romántico y luminoso creado para acompañarte en uno de los días más importantes de tu vida.\nEstá confeccionado con rosas importadas rosadas, combinadas con alstroemerias en tonos pastel y un delicado halo de paniculata (velo de novia) que aporta suavidad y un estilo etéreo. Cada flor se selecciona minuciosamente para asegurar frescura, armonía y una presentación impecable.\nEl ramo se envuelve en tul blanco y se finaliza con una cinta en tonos rosados que realza su estilo femenino, moderno y elegante. Ideal para novias que buscan un diseño clásico con un toque actual.\nPerfecto para ceremonias civiles o religiosas, sesiones de fotos y para acompañarte en cada paso de tu día especial.",
    price: 200.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con rosas rosadas y tul.webp"
  },
  {
    name: "Ramo de novia con flores de estación y rosas",
    description: "Elegante, delicado y lleno de frescura, este ramo combina rosas importadas de Ecuador en tonos pastel, margaritas silvestres y flores de temporada con toques verdes suaves. Cada flor fue cuidadosamente seleccionada para crear una composición romántica, ideal para novias que buscan un estilo natural y encantador. Perfecto para bodas al aire libre, civiles o sesiones de fotos inolvidables. Atado con un lazo de organza que le da el toque final de dulzura y sofisticación. Un ramo que habla de amor, pureza y belleza natural en cada pétalo.",
    price: 250.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con flores de estacion y rosas.webp"
  },
  {
    name: "Ramo de novia con margaritas",
    description: "Ramo de novia confeccionado a base de margaritas de colores acompañadas de hojas de salón. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 145.00,
    category: "Ramos de Novia",
    image: "Ramo de Novia con Margaritas.webp"
  },
  {
    name: "Ramo de novia astromelias y rosas blancas",
    description: "Ramo de novia confeccionado a base de astromelias y rosas blancas. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 225.00,
    category: "Ramos de Novia",
    image: "Ramo de novia astromelias y rosas blancas.webp"
  },
  {
    name: "Ramo de novia con astromelias",
    description: "Ramo de novia confeccionado a base de astromelias de colores y acompañado de hojas de salón. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 145.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con astromelias.webp"
  },
  {
    name: "Boutonnier de flores astromelias",
    description: "Boutonnier confeccionada con flores astromelias.",
    price: 60.00,
    category: "Boutonniers",
    image: "Boutonnier de flores astromelias.webp"
  },
  {
    name: "Boutonnier de flores isofilas",
    description: "Boutonnier confeccionado con flores isofilas.",
    price: 0,
    category: "Boutonniers",
    image: "Boutonnier de flores isofilas.webp"
  },
  {
    name: "Ramo de novia con astromelias e isofila",
    description: "Ramo de novia confeccionado a base de astromelias blancas y acompañado de Gysophilas. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 145.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con astromelias e isofila.webp"
  },
  {
    name: "Boutonnier de flores rosa spray",
    description: "Boutonnier confeccionado con flores rosas spray.",
    price: 60.00,
    category: "Boutonniers",
    image: "Boutonnier de flores rosa spray.webp"
  },
  {
    name: "Ramo de novia con calas",
    description: "Ramo de novia confeccionado a base de Calas, acompañadas de hojas de Salón.",
    price: 165.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con calas.webp"
  },
  {
    name: "Ramo de novia con claveles",
    description: "Ramo de novia confeccionado a base claveles. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 150.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con claveles.webp"
  },
  {
    name: "Boutonnier de flores san vicente",
    description: "Boutonnier confeccionada con flores san vicente.",
    price: 59.00,
    category: "Boutonniers",
    image: "Boutonnier de flores san vicente.webp"
  },
  {
    name: "Boutonniere de flores margaritas",
    description: "Boutonnier confeccionada con margaritas.",
    price: 59.00,
    category: "Boutonniers",
    image: "Boutonniere de flores margaritas.webp"
  },
  {
    name: "Ramo de novia con gerberas rosadas",
    description: "Ramo de novia confeccionado a base de gerberas rosadas. Colores pueden variar de acuerdo a la estación del año.",
    price: 189.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con gerberas rosadas.webp"
  },
  {
    name: "Ramo de novia con isofila",
    description: "Ramo de novia confeccionado a base de Isofilas.",
    price: 145.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con isofila.webp"
  },
  {
    name: "Ramo de novia con lilium lirios y rosas rosado",
    description: "Ramo de novia confeccionado a base de rosas y liliums rosados. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 0,
    category: "Ramos de Novia",
    image: "Ramo de novia con lilium lirios y rosas rosado.webp"
  },
  {
    name: "Ramo de novia con rosas",
    description: "Ramo de novia confeccionado a base de Rosas y acompañado de Gypsophilas. Color de la rosa puede variar de acuerdo a la estación del año y disponibilidad.",
    price: 240.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con rosas.webp"
  },
  {
    name: "Ramo de novia con rosas multicolor",
    description: "Ramo de novia confeccionado a base de rosas de colores varios.",
    price: 240.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con rosas multicolor.webp"
  },
  {
    name: "Ramo de novia de rosas rojas",
    description: "Ramo de novia confeccionado a base de rosas rojas nacionales.",
    price: 240.00,
    category: "Ramos de Novia",
    image: "Ramo de novia de rosas rojas.webp"
  },
  {
    name: "Ramo de novia de rosas rojas y gerberas blancas",
    description: "Ramo de novia confeccionado a base de rosas y gerberas blancas. Los colores pueden variar de acuerdo a la estación del año.",
    price: 235.00,
    category: "Ramos de Novia",
    image: "Ramo de novia de rosas rojas y gerberas blancas.webp"
  },
  {
    name: "Ramo de novia con lilium lirios",
    description: "Ramo de novia confeccionado a base de Liliums. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 210.00,
    category: "Ramos de Novia",
    image: "Ramo de novia con lilium lirios.webp"
  },
  {
    name: "Ramo de novia de rosas spray y margaritas",
    description: "Ramo de novia confeccionado a base de rosas spray y margaritas. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 200.00,
    category: "Ramos de Novia",
    image: "Ramo de novia de rosas Spray y margaritas.webp"
  },
  {
    name: "Ramo de novia flores rosas y lisciantos",
    description: "Ramo de novia confeccionado a base de Rosas y acompañado de Lisciantos. Color de la rosa y lisciantos puede variar de acuerdo a la estación del año y disponibilidad.",
    price: 250.00,
    category: "Ramos de Novia",
    image: null // No matching image
  },
  {
    name: "Ramo de novia liscianto",
    description: "Ramo de novia confeccionado a base de liscianto. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 215.00,
    category: "Ramos de Novia",
    image: "Ramo de Novia Liscianto.webp"
  },
  {
    name: "Ramo de novia rosas y gerberas blancas",
    description: "Ramo de novia confeccionado a base de rosas y gerberas blancas. Colores pueden variar de acuerdo a la estación del año.",
    price: 215.00,
    category: "Ramos de Novia",
    image: "Ramo de novia rosas y gerberas blancas.webp"
  },
  {
    name: "Ramo de novia staties",
    description: "Ramo de novia confeccionado a base de Staties multicolor. Flores y colores pueden variar de acuerdo a la estación del año.",
    price: 100.00,
    category: "Ramos de Novia",
    image: "Ramo de novia staties.webp"
  },
  {
    name: "Ramo de rosas rosadas y liliums con Champagne Jasmine Monet",
    description: "Este sofisticado ramo combina la suavidad de las rosas rosadas con la elegancia de los liliums blancos, creando un arreglo delicado, romántico y lleno de frescura. Cada flor ha sido seleccionada para lograr una armonía perfecta entre color, textura y aroma, ideal para transmitir amor, ternura y buenos deseos.\nEl ramo está presentado en un envoltorio premium en capas con detalles modernos, que realza la belleza natural de las flores y le aporta un estilo elegante y actual, listo para regalar.\nEl combo se completa con una botella de Champagne Jasmine Monet, perfecta para brindar y celebrar momentos especiales.\nIdeal para: Cumpleaños, Aniversarios, San Valentín, Felicitaciones, Regalos románticos, Sorprender a alguien especial.\nIncluye: Ramo de rosas rosadas y liliums blancos, flores verdes y rellenos decorativos, presentación premium, Champagne Jasmine Monet.",
    price: 200.00,
    category: "Ramos con Champagne",
    image: null
  },
  {
    name: "Ramo de margaritas blancas con Champagne Jasmine Monet White",
    description: "Este encantador ramo de margaritas blancas transmite alegría, frescura y pureza, convirtiéndose en un regalo ideal para iluminar cualquier ocasión. Sus flores abundantes y naturales crean una composición luminosa, delicada y llena de vida, perfecta para expresar cariño, gratitud y buenos deseos.\nEl ramo está envuelto en papel kraft premium y terminado con un lazo textil en tono natural, logrando una presentación cálida, moderna y elegante, lista para regalar.\nEl combo se completa con una botella de Champagne Jasmine Monet White, perfecta para brindar y celebrar momentos especiales con un toque de sofisticación.\nIdeal para: Cumpleaños, Agradecimientos, Nacimientos, Felicitaciones, Regalos delicados, Sorpresas especiales.\nIncluye: Ramo de margaritas blancas premium, presentación kraft con lazo, Champagne Jasmine Monet White.",
    price: 98.00,
    category: "Ramos con Champagne",
    image: null
  },
  {
    name: "Ramo de gerberas fucsia con Champagne Jasmine Monet",
    description: "Este impactante ramo de gerberas fucsia es una explosión de color, alegría y elegancia, ideal para sorprender con un regalo moderno y lleno de energía positiva. Las gerberas, símbolo de admiración, felicidad y amor sincero, se combinan con delicados detalles de flores blancas y mariposas decorativas, creando una presentación sofisticada y visualmente irresistible.\nEl arreglo está envuelto en un papel premium en capas translúcidas, que realza los colores y le da un estilo de boutique floral de alta gama.\nEl combo se completa con una botella de Champagne Jasmine Monet, perfecta para brindar y convertir cualquier momento en una celebración especial.\nIdeal para: Cumpleaños, Aniversarios, Felicitaciones, Regalos románticos, Celebraciones especiales, Sorprender con algo diferente y elegante.\nIncluye: Ramo de gerberas fucsia premium, flores blancas y detalles decorativos, presentación de lujo, Champagne Jasmine Monet.",
    price: 128.00,
    category: "Ramos con Champagne",
    image: null
  },
  {
    name: "Ramo de flores de estación con rosas barbie y Champagne Jasmine Monet",
    description: "Este vibrante ramo combina la intensidad del fucsia con la pureza del blanco, creando un arreglo moderno, alegre y lleno de personalidad. Está compuesto por una cuidada selección de rosas, gerberas, crisantemos y liliums, acompañados de follaje y detalles decorativos que realzan su belleza y volumen.\nEl ramo se presenta envuelto en un papel premium en tonos fucsia y rosa, con un elegante lazo que lo convierte en un regalo impactante y sofisticado desde el primer vistazo.\nEl combo se completa con una botella de Champagne Jasmine Monet, ideal para brindar y celebrar momentos especiales.\nIdeal para: Cumpleaños, Aniversarios, Felicitaciones, Regalos románticos, Sorpresas especiales, Celebraciones importantes.\nIncluye: Ramo de flores combinadas en tonos fucsia y blanco, detalles decorativos premium, presentación de lujo, Champagne Jasmine Monet.",
    price: 134.00,
    category: "Ramos con Champagne",
    image: null
  },
  {
    name: "Ramo romántico con globo Te Amo y Champagne Jasmine Monet",
    description: "Sorprendé a quien más querés con este elegante y apasionado combo que combina flores premium y burbujas para celebrar el amor como se merece.\nEste arreglo está compuesto por un delicado ramo de rosas rosadas, flores de estación y follaje decorativo, envuelto en papel premium y terminado con un lazo de cinta, que le da un estilo sofisticado y listo para regalar. En el centro se destaca un globo metalizado en forma de corazón con la frase \"Te Amo\", que transmite el mensaje más importante sin necesidad de palabras.\nEl regalo se completa con una botella de Champagne Jasmine Monet, ideal para brindar y hacer de ese momento algo inolvidable.\nIdeal para: Aniversarios, Cumpleaños, San Valentín, Propuestas, Sorprender a tu pareja, Regalos románticos.\nIncluye: Ramo de rosas rosadas y flores combinadas, globo metalizado corazón \"Te Amo\", Champagne Jasmine Monet, presentación premium lista para regalar.",
    price: 124.00,
    category: "Ramos con Champagne",
    image: null
  },
  {
    name: "Ramo de flores de estación blancas con papel coreano",
    description: "Descubrí la delicadeza del Ramo Blanco Puro, una combinación perfecta de lilium blancos, gerberas, crisantemos, eucaliptos y finos follajes que aportan frescura, armonía y un estilo moderno inigualable. Su presentación con papeles en tonos celestes y blancos resalta aún más la pureza de las flores, convirtiéndolo en un regalo elegante y sofisticado para cualquier ocasión especial.\nEste ramo es ideal para transmitir paz, agradecimiento, buenos deseos y cariño genuino. Perfecto para cumpleaños, aniversarios, nacimientos, agradecimientos o como gesto de acompañamiento emocional.",
    price: 85.00,
    category: "Ramos de Flores",
    image: null
  },
  {
    name: "Ramo 24 rosas rojas con papel coreano",
    description: "Sorprendé con este hermoso ramo de 24 rosas rojas, con brillantes y papel coreano. Ideal para regalar en cualquier ocasión.",
    price: 199.00,
    category: "Ramos de Flores",
    image: null
  },
  {
    name: "Ramo de 36 rosas rojas y corona de Ferrero Rocher",
    description: "Ramo de Amor Exclusivo. ¡Sorprende a esa persona especial con un regalo único y elegante! Nuestro ramo de 36 rosas rojas frescas y de alta calidad, cuidadosamente seleccionadas y arregladas para crear un diseño impresionante, es el acompañamiento perfecto para expresar tus sentimientos más profundos. Este ramo exclusivo viene coronado con una delicada guirnalda de bombones Ferrero Rocher, el toque perfecto de dulzura y sofisticación para hacer que tu regalo sea verdaderamente inolvidable. Este ramo es ideal para cumpleaños, aniversarios, San Valentín o simplemente para demostrar tu amor y aprecio. Haz que tu regalo sea verdaderamente especial.",
    price: 280.00,
    category: "Ramos de Flores",
    image: null
  },
  {
    name: "Ramo de 36 rosas amarillas importadas con papel coreano",
    description: "36 rosas amarillas importadas envueltas en papel coreano. Ideal para regalar en cualquier ocasión.",
    price: 350.00,
    category: "Ramos de Flores",
    image: null
  },
];

async function uploadImage(fileName) {
  const filePath = join(IMAGES_DIR, fileName);
  const fileBuffer = readFileSync(filePath);

  // Generate unique storage name
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
  const storageName = `${hex}-${Date.now()}.webp`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(storageName, fileBuffer, { contentType: 'image/webp' });

  if (error) {
    console.error(`  ❌ Error uploading ${fileName}:`, error.message);
    return null;
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(storageName);
  return data.publicUrl;
}

async function main() {
  console.log('🚀 Starting product upload...\n');

  let success = 0;
  let failed = 0;
  let noPrice = [];

  for (const product of products) {
    console.log(`📦 Processing: ${product.name}`);

    let imageUrl = null;

    // Upload image if available
    if (product.image) {
      console.log(`  📸 Uploading image: ${product.image}`);
      imageUrl = await uploadImage(product.image);
      if (imageUrl) {
        console.log(`  ✅ Image uploaded`);
      }
    } else {
      console.log(`  ⚠️  No image available`);
    }

    // Track products without price
    if (product.price === 0) {
      noPrice.push(product.name);
    }

    // Insert product
    const { error } = await supabase.from('products').insert([{
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: imageUrl,
      in_stock: product.price > 0, // Mark as out of stock if no price
    }]);

    if (error) {
      console.error(`  ❌ Error inserting: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✅ Product saved\n`);
      success++;
    }
  }

  console.log('\n========================================');
  console.log(`✅ Products loaded: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Total: ${products.length}`);

  if (noPrice.length > 0) {
    console.log(`\n⚠️  Products without price (marked as out of stock):`);
    noPrice.forEach(n => console.log(`   - ${n}`));
  }

  console.log('\n🎉 Done!');
}

main().catch(console.error);
