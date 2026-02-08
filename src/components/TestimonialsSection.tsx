import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Florencia Pérez",
    text: "Desde el primer encuentro nos dio la seguridad que queríamos. Todo fue super planificado y detallado. El día de nuestra boda fue uno de los días más increíbles de nuestras vidas. ¡La recomendamos 100%!",
  },
  {
    name: "Jen Gonzalez",
    text: "Romi and her team were A++. Everything was planned and accounted for from day one. She omits a level of professionalism and confidence that really allows you to relax. If you are considering Romi, don't hesitate.",
  },
  {
    name: "Sol Espinosa",
    text: "Romi tuvo en cuenta cada cosa que pedimos, se adelantaba a nuestras necesidades. Nos quedamos con un hermoso recuerdo y una amiga querida que logró que disfrutáramos todo el proceso.",
  },
  {
    name: "Gabriela Salgado",
    text: "Hicimos un destination wedding y todo estuvo perfecto. No necesité estar presente para ningún detalle. 100% mi mejor inversión para tener paz mental. Romi es súper simpática y sabe exactamente lo que cada novia quiere.",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section id="testimonios" className="py-24 md:py-32 bg-charcoal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-section">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-light font-body mb-3">
            Testimonios
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-primary-foreground">
            Lo que dicen <span className="italic">nuestros clientes</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto text-center fade-in-section">
          <Quote className="mx-auto mb-8 text-gold/40" size={40} />
          <p className="font-serif text-xl md:text-2xl text-primary-foreground/80 italic leading-relaxed mb-8 min-h-[120px]">
            "{t.text}"
          </p>
          <div className="w-8 h-px bg-gold mx-auto mb-4" />
          <p className="text-sm uppercase tracking-[0.2em] font-body text-gold-light">
            {t.name}
          </p>

          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              aria-label="Anterior testimonio"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-gold w-6" : "bg-primary-foreground/30"
                  }`}
                  aria-label={`Testimonio ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
