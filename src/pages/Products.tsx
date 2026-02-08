import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const Products = () => {
  const containerRef = useScrollFadeIn();

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

      {/* Products Grid - Placeholder */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Placeholder cards - will be replaced with actual products */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="group fade-in-section"
                style={{ transitionDelay: `${item * 0.1}s` }}
              >
                <div className="relative overflow-hidden aspect-[3/4] bg-sand mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-warm-gray/40 font-display text-xl italic">
                      Producto {item}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-all duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-display text-xl md:text-2xl font-light text-foreground mb-2">
                    Producto Ejemplo {item}
                  </h3>
                  <p className="text-sm text-warm-gray font-body mb-3">
                    Categoría
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold font-body">
                    Próximamente
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Message */}
          <div className="mt-20 text-center fade-in-section">
            <div className="inline-block border border-gold/30 px-8 py-6 max-w-2xl">
              <p className="text-sm md:text-base text-foreground/70 font-body font-light leading-relaxed">
                Estamos preparando una selección exclusiva de productos para ti. 
                Pronto podrás encontrar aquí todo lo necesario para hacer de tu evento una experiencia inolvidable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
