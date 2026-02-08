import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Evento elegante al atardecer"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-charcoal/40" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <p
          className="text-xs uppercase tracking-[0.4em] text-primary-foreground/80 font-body mb-4 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          Social & Corporate Events
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
          We Create, You Celebrate
        </p>
        <a
          href="#contacto"
          className="mt-10 inline-block border border-primary-foreground/60 text-primary-foreground px-10 py-4 text-xs uppercase tracking-[0.3em] font-body hover:bg-primary-foreground hover:text-foreground transition-all duration-500 animate-fade-in"
          style={{ animationDelay: "1.2s" }}
        >
          Agendar Consulta
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1.5s" }}>
        <div className="w-px h-12 bg-primary-foreground/40 mx-auto mb-2" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50 font-body">
          Scroll
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
