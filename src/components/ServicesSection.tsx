import socialImg from "@/assets/social-event.jpg";
import corporateImg from "@/assets/corporate-event.jpg";

const services = [
  {
    title: "Eventos Sociales",
    subtitle: "Bodas · Quinces · Aniversarios · Bautismos",
    description:
      "Celebraciones únicas donde cada detalle refleja tu historia. Desde bodas de ensueño hasta fiestas íntimas, creamos momentos inolvidables.",
    image: socialImg,
    alt: "Evento social elegante",
  },
  {
    title: "Eventos Corporativos",
    subtitle: "Conferencias · Lanzamientos · Team Building · Galas",
    description:
      "Experiencias corporativas que inspiran. Planificación integral de eventos que fortalecen marcas y crean conexiones duraderas.",
    image: corporateImg,
    alt: "Evento corporativo profesional",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-section">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-body mb-3">
            Nuestros Servicios
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground">
            Experiencias <span className="italic">Extraordinarias</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group fade-in-section relative overflow-hidden"
              style={{ transitionDelay: `${i * 0.2}s` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent flex flex-col justify-end p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.25em] text-gold-light font-body mb-2">
                  {service.subtitle}
                </p>
                <h3 className="font-display text-2xl md:text-3xl text-primary-foreground font-light mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-primary-foreground/70 font-body font-light leading-relaxed max-w-md">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
