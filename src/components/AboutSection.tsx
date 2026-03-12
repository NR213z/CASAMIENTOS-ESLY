import profileImg from "@/assets/new_images/esly_carlos.jpg";

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
                alt="Esly y Leonel"
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
              Esly <span className="italic">y Leonel</span>
            </h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <p className="text-sm md:text-base font-body font-light text-muted-foreground leading-relaxed mb-6">
              Creamos eventos que inspiran, emocionan y dejan recuerdos inolvidables. Nos especializamos en la planificación, producción y diseño integral de experiencias que conectan a las personas y fortalecen los vínculos.
            </p>
            <p className="text-sm md:text-base font-body font-light text-muted-foreground leading-relaxed mb-6">
              Organizamos una amplia variedad de eventos corporativos y sociales: Fiestas de Fin de Año, Conferencias, Workshops, Lanzamientos de Productos, Team Building, Jornadas de Integración, Inauguraciones, Family Days, Aniversarios Corporativos, celebraciones del Día del Niño, Puertas Abiertas, Eventos Virtuales y mucho más.
            </p>
            <p className="text-sm md:text-base font-body font-light text-muted-foreground leading-relaxed mb-8">
              Cada proyecto es único y lo desarrollamos cuidando cada detalle para lograr experiencias memorables.
            </p>
            <p className="font-serif text-xl italic text-foreground/80 mb-4">
              "Tú historia es nuestra historia"
            </p>
            <p className="font-serif text-2xl font-semibold text-gold">
              ¡Bora Viver!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
