
import React from 'react';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="section bg-cream relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-dark mb-6">Contacto</h2>
                    <p className="text-xl text-text-light font-light leading-relaxed">
                        Estamos listos para hacer realidad tus sueños. <br />
                        Escribinos para comenzar a planificar algo único.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Contact Cards - WhatsApp & Email */}
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch mb-16">

                        {/* WhatsApp Card */}
                        <a
                            href="https://wa.me/5491140253383"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex-1 max-w-md p-10 bg-white border border-border rounded-lg hover:shadow-champagne hover:border-champagne/40 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-cream text-champagne shadow-sm group-hover:bg-champagne group-hover:text-white transition-all duration-300">
                                <Phone size={36} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-serif text-dark mb-3">WhatsApp</h3>
                            <p className="text-text-light mb-4 text-sm">Envíanos un mensaje directo</p>
                            <span className="text-lg font-semibold text-dark group-hover:text-champagne transition-colors">
                                +54 9 11 4025-3383
                            </span>
                        </a>

                        {/* Email Card */}
                        <a
                            href="mailto:contacto@rominaferraretto.com"
                            className="group flex-1 max-w-md p-10 bg-white border border-border rounded-lg hover:shadow-champagne hover:border-champagne/40 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-cream text-champagne shadow-sm group-hover:bg-champagne group-hover:text-white transition-all duration-300">
                                <Mail size={36} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-serif text-dark mb-3">Email</h3>
                            <p className="text-text-light mb-4 text-sm">Para consultas generales</p>
                            <span className="text-lg font-semibold text-dark group-hover:text-champagne transition-colors break-all">
                                contacto@rominaferraretto.com
                            </span>
                        </a>
                    </div>

                    {/* Seguinos Section */}
                    <div className="flex flex-col items-center justify-center py-8 border-t border-border">
                        <h3 className="text-lg font-serif text-dark mb-6 tracking-wide">Seguinos</h3>
                        <div className="flex items-center gap-6">
                            <a
                                href="https://www.facebook.com/rominaferraretto"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 text-text-light hover:text-champagne transition-colors"
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-border group-hover:bg-champagne group-hover:border-champagne group-hover:text-white transition-all shadow-sm">
                                    <Facebook size={22} strokeWidth={1.5} />
                                </div>
                                <span className="font-medium tracking-wide hidden sm:inline">Facebook</span>
                            </a>

                            <a
                                href="https://www.instagram.com/rominaferraretto"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 text-text-light hover:text-champagne transition-colors"
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-border group-hover:bg-champagne group-hover:border-champagne group-hover:text-white transition-all shadow-sm">
                                    <Instagram size={22} strokeWidth={1.5} />
                                </div>
                                <span className="font-medium tracking-wide hidden sm:inline">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-12 mt-12 border-t border-border">
                    <p className="text-sm text-text-light">
                        &copy; {new Date().getFullYear()} Romina Ferraretto. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
