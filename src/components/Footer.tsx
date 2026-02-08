const Footer = () => {
  return (
    <footer className="py-12 bg-charcoal">
      <div className="container mx-auto px-6 text-center">
        <p className="font-display text-lg text-primary-foreground/80 mb-2">
          Romina <span className="italic font-light">Ferraretto</span>
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/40 font-body">
          Social & Corporate Events
        </p>
        <div className="w-8 h-px bg-gold/30 mx-auto my-6" />
        <p className="text-xs text-primary-foreground/30 font-body">
          © {new Date().getFullYear()} Romina Ferraretto. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
