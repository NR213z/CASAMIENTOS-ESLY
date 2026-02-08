import { useState } from "react";
import { Instagram, Linkedin, Mail, Phone } from "lucide-react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would handle form submission
    alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contacto" className="py-24 md:py-32 bg-sand">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-section">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-body mb-3">
            Contacto
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground">
            Hagamos realidad <span className="italic">tu evento</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 fade-in-section">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-body text-muted-foreground mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-border py-3 text-sm font-body text-foreground focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-body text-muted-foreground mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-border py-3 text-sm font-body text-foreground focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-body text-muted-foreground mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-border py-3 text-sm font-body text-foreground focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-body text-muted-foreground mb-2">
                Mensaje
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full bg-transparent border-b border-border py-3 text-sm font-body text-foreground focus:border-gold focus:outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="border border-foreground text-foreground px-10 py-4 text-xs uppercase tracking-[0.3em] font-body hover:bg-foreground hover:text-background transition-all duration-500 mt-4"
            >
              Enviar Mensaje
            </button>
          </form>

          {/* Info */}
          <div className="fade-in-section flex flex-col justify-center" style={{ transitionDelay: "0.2s" }}>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Phone size={18} className="text-gold mt-1 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] font-body text-muted-foreground mb-1">
                    Teléfono
                  </p>
                  <p className="font-body text-foreground">+54 9 11 4025-3383</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={18} className="text-gold mt-1 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] font-body text-muted-foreground mb-1">
                    Email
                  </p>
                  <p className="font-body text-foreground">romina@rominaferraretto.com</p>
                </div>
              </div>

              <div className="w-full h-px bg-border my-8" />

              <div className="flex gap-6">
                <a
                  href="https://www.instagram.com/rominaferraretto/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-gold transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={22} />
                </a>
                <a
                  href="https://www.linkedin.com/in/rominaferraretto/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-gold transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={22} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
