import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { supabase, Product } from "@/lib/supabase";

const Products = () => {
  const containerRef = useScrollFadeIn();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  return (
    <div ref={containerRef}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-cream to-background">
        <div className="container mx-auto px-6">
          <div className="text-center fade-in-section">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-body mb-3">
              Nuestra Colección
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-6">
              Productos <span className="italic">Exclusivos</span>
            </h1>
            <p className="text-base md:text-lg text-warm-gray font-body font-light max-w-2xl mx-auto">
              Descubre nuestra selección curada de productos premium para hacer de tu evento algo verdaderamente especial.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-warm-gray font-body">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="mt-20 text-center fade-in-section">
              <div className="inline-block border border-gold/30 px-8 py-6 max-w-2xl">
                <p className="text-sm md:text-base text-foreground/70 font-body font-light leading-relaxed">
                  Estamos preparando una selección exclusiva de productos para ti.
                  Pronto podrás encontrar aquí todo lo necesario para hacer de tu evento una experiencia inolvidable.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className="group fade-in-section"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="relative overflow-hidden aspect-[3/4] bg-sand mb-6">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-warm-gray/40 font-display text-xl italic">
                          Sin imagen
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-all duration-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-display text-xl md:text-2xl font-light text-foreground mb-2">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="text-xs uppercase tracking-[0.15em] text-warm-gray font-body mb-1">
                        {product.category}
                      </p>
                    )}
                    <p className="text-lg text-gold font-body">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
