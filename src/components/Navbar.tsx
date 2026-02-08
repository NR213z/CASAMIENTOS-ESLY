import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Inicio", href: "#inicio", isRoute: false },
  { label: "Servicios", href: "#servicios", isRoute: false },
  { label: "Galería", href: "#galeria", isRoute: false },
  { label: "Nosotros", href: "#nosotros", isRoute: false },
  { label: "Testimonios", href: "#testimonios", isRoute: false },
  { label: "Productos", href: "/productos", isRoute: true },
  { label: "Contacto", href: "#contacto", isRoute: false },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.isRoute) {
      e.preventDefault();
      navigate(link.href);
      setOpen(false);
      window.scrollTo(0, 0);
    } else {
      // For hash links, if we're not on the home page, navigate there first
      if (location.pathname !== '/') {
        e.preventDefault();
        navigate('/');
        // Wait for navigation, then scroll to section
        setTimeout(() => {
          const element = document.querySelector(link.href);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // We are on home page, normal smooth scroll behavior
      }
      setOpen(false);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-background/95 backdrop-blur-md shadow-sm py-3"
        : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <a
          href="/"
          onClick={handleLogoClick}
          className="font-display text-xl tracking-wider text-foreground"
        >
          Romina <span className="italic font-light">Ferraretto</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="text-xs uppercase tracking-[0.2em] font-body font-medium text-foreground/70 hover:text-foreground transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-t border-border animate-fade-in">
          <div className="flex flex-col items-center py-8 gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="text-sm uppercase tracking-[0.2em] font-body text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
