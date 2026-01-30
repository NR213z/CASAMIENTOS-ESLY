import React from 'react';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="section bg-dark text-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-white mb-8">Contacto</h2>
                    <p className="text-xl text-off-white mb-12 font-light leading-relaxed">
                        Estamos listos para hacer realidad tus sueños. Contáctanos para comenzar a planificar una experiencia inolvidable.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-16">
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gold/30 group-hover:bg-gold/10 transition-colors">
                                <Phone className="text-gold" size={20} />
                            </div>
                            <div className="text-left">
                                <span className="block text-xs uppercase tracking-widest text-gold mb-1">WhatsApp</span>
                                <span className="text-lg">+54 9 11 1234-5678</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gold/30 group-hover:bg-gold/10 transition-colors">
                                <Mail className="text-gold" size={20} />
                            </div>
                            <div className="text-left">
                                <span className="block text-xs uppercase tracking-widest text-gold mb-1">Email</span>
                                <span className="text-lg">contacto@rominaferraretto.com</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-charcoal">
                        <h4 className="text-sm uppercase tracking-widest mb-6 text-gold">Síguenos</h4>
                        <div className="flex justify-center gap-6">
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-gold hover:text-gold transition-all duration-300">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-gold hover:text-gold transition-all duration-300">
                                <Facebook size={20} />
                            </a>
                        </div>
                        <p className="text-xs text-muted mt-12">
                            &copy; {new Date().getFullYear()} Romina Ferraretto. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
