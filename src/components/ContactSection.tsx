import { useState } from "react";
import { Instagram, Linkedin, Mail, Phone, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert([{
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          message: form.message.trim(),
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
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
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-body font-medium">¡Mensaje enviado!</p>
                  <p className="text-xs font-body mt-1">Te contactaremos pronto.</p>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-body">
                {error}
              </div>
            )}
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
              disabled={loading}
              className="border border-foreground text-foreground px-10 py-4 text-xs uppercase tracking-[0.3em] font-body hover:bg-foreground hover:text-background transition-all duration-500 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading && <Loader2 className="animate-spin" size={14} />}
              {loading ? "Enviando..." : "Enviar Mensaje"}
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
                  <p className="font-body text-foreground">+54 9 11 6907-4807</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={18} className="text-gold mt-1 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] font-body text-muted-foreground mb-1">
                    Email
                  </p>
                  <p className="font-body text-foreground">boravivercelebrations@gmail.com</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
