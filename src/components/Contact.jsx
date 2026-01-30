import React from 'react';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="section bg-dark text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-white mb-16">Contacto</h2>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Form */}
                    <div className="w-full lg:w-1/2">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm uppercase tracking-widest mb-2 text-gold">Nombre</label>
                                <input type="text" className="w-full p-3 bg-transparent border border-white/20 focus:border-gold text-white outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm uppercase tracking-widest mb-2 text-gold">Correo Electrónico</label>
                                <input type="email" className="w-full p-3 bg-transparent border border-white/20 focus:border-gold text-white outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm uppercase tracking-widest mb-2 text-gold">Teléfono</label>
                                <input type="tel" className="w-full p-3 bg-transparent border border-white/20 focus:border-gold text-white outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm uppercase tracking-widest mb-2 text-gold">Mensaje</label>
                                <textarea rows="4" className="w-full p-3 bg-transparent border border-white/20 focus:border-gold text-white outline-none transition-colors"></textarea>
                            </div>
                            <button type="submit" className="btn btn-gold w-full">Enviar Mensaje</button>
                        </form>
                    </div>

                    {/* Info */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-12">
                        <div>
                            <h3 className="text-2xl font-serif mb-6 text-gold-light">Hablemos de tu evento</h3>
                            <p className="text-off-white mb-8 font-light leading-relaxed">
                                Estamos listos para hacer realidad tus sueños. Contáctanos para comenzar a planificar una experiencia inolvidable.
                            </p>

                            <div className="space-y-4 mb-12">
                                <div className="flex items-center gap-4">
                                    <Phone className="text-gold" />
                                    <span>+54 9 11 4025-3383</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className="text-gold" />
                                    <span>[email protected]</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-charcoal">
                            <h4 className="text-sm uppercase tracking-widest mb-4 text-gold">Síguenos</h4>
                            <div className="flex gap-4">
                                <a href="#" className="hover:text-gold transition-colors"><Instagram /></a>
                                <a href="#" className="hover:text-gold transition-colors"><Facebook /></a>
                            </div>
                            <p className="text-xs text-muted mt-8">
                                &copy; {new Date().getFullYear()} Romina Ferraretto. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
