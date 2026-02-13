import profileImg from "@/assets/new_images/about_img.png";

const AboutSection = () => {
  return (
    <section id="nosotros" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image */}
          <div className="fade-in-section">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={profileImg}
                alt="Romina Ferraretto"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div className="fade-in-section" style={{ transitionDelay: "0.2s" }}>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-body mb-3">
              Sobre Nosotros
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground mb-6">
              Romina <span className="italic">Ferraretto</span>
            </h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <p className="text-sm md:text-base font-body font-light text-muted-foreground leading-relaxed mb-6">
              Reconocida internacionalmente como una de las 150 "Top Destination Wedding Planners" del mundo
              por el Destination Wedding Planners Congress "DWP". Con más de dos décadas de experiencia,
              Romina brinda servicios personalizados, destacando por su creatividad y exclusividad.
            </p>
            <p className="text-sm md:text-base font-body font-light text-muted-foreground leading-relaxed mb-8">
              Pionera en bodas destino en Argentina, ha diseñado eventos para parejas de todo el mundo.
              Su habilidad para fusionar estilos individuales con diseños visionarios garantiza celebraciones
              impecables y memorables.
            </p>
            <p className="font-serif text-xl italic text-foreground/80">
              "We Create, You Celebrate"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
