import React from 'react';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="section bg-dark text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-white mb-8">Contacto</h2>
                    <p className="text-xl text-off-white font-light leading-relaxed">
                        Estamos listos para hacer realidad tus sueños. <br />
                        Contáctanos para comenzar a planificar una experiencia inolvidable.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* WhatsApp Card */}
                    <a href="https://wa.me/5491140253383" target="_blank" rel="noopener noreferrer" className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-gold/50 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                            <Phone size={32} />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">WhatsApp</h3>
                        <p className="text-muted group-hover:text-off-white transition-colors">+54 9 11 4025-3383</p>
                    </a>

                    {/* Email Card */}
                    <a href="mailto:contacto@rominaferraretto.com" className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-gold/50 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">Email</h3>
                        <p className="text-muted group-hover:text-off-white transition-colors">contacto@rominaferraretto.com</p>
                    </a>

                    {/* Social Card */}
                    <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-gold/50 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gold/10 text-gold transition-colors">
                            <Instagram size={32} />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-4">Redes Sociales</h3>
                        <div className="flex justify-center gap-4">
                            <a href="#" className="text-off-white hover:text-gold transition-colors">Instagram</a>
                            <span className="text-white/20">|</span>
                            <a href="#" className="text-off-white hover:text-gold transition-colors">Facebook</a>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-white/10">
                    <p className="text-sm text-muted">
                        &copy; {new Date().getFullYear()} Romina Ferraretto. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
