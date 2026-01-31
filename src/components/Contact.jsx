import React, { useState } from 'react';
import { Mail, Phone, Instagram, Facebook, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const { error } = await supabase
                .from('contacts')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        message: formData.message
                    }
                ]);

            if (error) throw error;

            setStatus({ loading: false, success: true, error: null });
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus({ loading: false, success: false, error: 'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.' });
        }
    };

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* WhatsApp Card */}
                            <a href="https://wa.me/5491140253383" target="_blank" rel="noopener noreferrer" className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4">
                                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                                    <Phone size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-serif text-white">WhatsApp</h3>
                                    <p className="text-muted group-hover:text-off-white transition-colors text-sm">+54 9 11 4025-3383</p>
                                </div>
                            </a>

                            {/* Email Card */}
                            <a href="mailto:contacto@rominaferraretto.com" className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4">
                                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                                    <Mail size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-serif text-white">Email</h3>
                                    <p className="text-muted group-hover:text-off-white transition-colors text-sm">contacto@rominaferraretto.com</p>
                                </div>
                            </a>

                            {/* Social Card */}
                            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-gold/50 transition-all duration-300 flex items-center gap-4">
                                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gold/10 text-gold transition-colors">
                                    <Instagram size={24} />
                                </div>
                                <div className="text-left flex-grow">
                                    <h3 className="text-lg font-serif text-white mb-1">Redes Sociales</h3>
                                    <div className="flex gap-4 text-sm">
                                        <a href="#" className="text-off-white hover:text-gold transition-colors">Instagram</a>
                                        <span className="text-white/20">|</span>
                                        <a href="#" className="text-off-white hover:text-gold transition-colors">Facebook</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
                        <h3 className="text-2xl font-serif text-white mb-6">Envíanos un mensaje</h3>

                        {status.success && (
                            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6 flex items-center gap-3">
                                <CheckCircle size={20} />
                                <span>¡Mensaje enviado con éxito! Te contactaremos pronto.</span>
                            </div>
                        )}

                        {status.error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-3">
                                <AlertCircle size={20} />
                                <span>{status.error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm text-off-white mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm text-off-white mb-1">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm text-off-white mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        placeholder="+54 11 ..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm text-off-white mb-1">Mensaje</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                                    placeholder="¿En qué podemos ayudarte?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status.loading}
                                className="w-full btn btn-gold mt-2 flex items-center justify-center gap-2 group"
                            >
                                {status.loading ? (
                                    <span>Enviando...</span>
                                ) : (
                                    <>
                                        <span>Enviar Mensaje</span>
                                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
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
