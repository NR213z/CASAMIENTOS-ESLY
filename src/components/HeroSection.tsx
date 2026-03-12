import { useEffect, useState } from "react";
import heroBg1 from "@/assets/new_images/hero_bg.png";
import heroBg2 from "@/assets/new_images/hero_bg2.jpg";
import heroBg3 from "@/assets/new_images/hero_bg3.jpg";
import heroBg4 from "@/assets/new_images/hero_bg4.jpg";

const images = [heroBg1, heroBg2, heroBg3, heroBg4];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 700);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFading(false);
      }, 700);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={images[current]}
          alt="Evento elegante"
          className="w-full h-full object-cover"
          style={{
            transition: "opacity 0.7s ease-in-out",
            opacity: fading ? 0 : 1,
          }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-charcoal/40" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <p
          className="text-xs uppercase tracking-[0.4em] text-primary-foreground/80 font-body mb-4 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          Eventos Sociales & Corporativos
        </p>
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground font-light leading-tight animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          Hacemos realidad
          <br />
          <span className="italic">tus sueños</span>
        </h1>
        <p
          className="mt-6 text-sm md:text-base text-primary-foreground/70 font-body font-light max-w-lg animate-fade-in"
          style={{ animationDelay: "0.9s" }}
        >
          Nosotros Creamos, Vos Celebrás
        </p>
        <a
          href="#contacto"
          className="mt-10 inline-block border border-primary-foreground/60 text-primary-foreground px-10 py-4 text-xs uppercase tracking-[0.3em] font-body hover:bg-primary-foreground hover:text-foreground transition-all duration-500 animate-fade-in"
          style={{ animationDelay: "1.2s" }}
        >
          Agendar Consulta
        </a>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1.5s" }}>
        <div className="w-px h-12 bg-primary-foreground/40 mx-auto mb-2" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50 font-body">
          Deslizar
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
