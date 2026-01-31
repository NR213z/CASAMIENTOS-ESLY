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
            setStatus({ loading: false, success: false, error: 'Hubo un error al enviar el mensaje. Intenta nuevamente.' });
        }
    };

    return (
        <section id="contact" className="section bg-white relative overflow-hidden">

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h2 className="text-dark mb-6">Contacto</h2>
                    <p className="text-xl text-text-light font-light leading-relaxed">
                        Estamos listos para hacer realidad tus sueños. <br />
                        Escribinos para comenzar a planificar algo único.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Contact Info - Left Side (4 columns) */}
                    <div className="lg:col-span-4 space-y-10">

                        <div className="group flex items-start gap-4">
                            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-off-white text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif text-dark mb-1">WhatsApp</h3>
                                <a href="https://wa.me/5491140253383" target="_blank" rel="noopener noreferrer" className="text-text-light hover:text-gold transition-colors block">
                                    +54 9 11 4025-3383
                                </a>
                            </div>
                        </div>

                        <div className="group flex items-start gap-4">
                            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-off-white text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif text-dark mb-1">Email</h3>
                                <a href="mailto:contacto@rominaferraretto.com" className="text-text-light hover:text-gold transition-colors block break-all">
                                    contacto@rominaferraretto.com
                                </a>
                            </div>
                        </div>

                        <div className="group flex items-start gap-4">
                            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-off-white text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300">
                                <Instagram size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif text-dark mb-1">Síguenos</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="text-text-light hover:text-gold transition-colors">Instagram</a>
                                    <span className="text-gray-300">|</span>
                                    <a href="#" className="text-text-light hover:text-gold transition-colors">Facebook</a>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Contact Form - Right Side (8 columns) */}
                    <div className="lg:col-span-8 bg-off-white p-8 md:p-12 rounded-xl shadow-sm">
                        <h3 className="text-2xl font-serif text-dark mb-8">Envíanos un mensaje</h3>

                        {status.success && (
                            <div className="bg-green-50 text-green-700 border border-green-100 p-4 rounded-lg mb-8 flex items-center gap-3">
                                <CheckCircle size={20} />
                                <span>¡Mensaje enviado con éxito! Te contactaremos pronto.</span>
                            </div>
                        )}

                        {status.error && (
                            <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-lg mb-8 flex items-center gap-3">
                                <AlertCircle size={20} />
                                <span>{status.error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        placeholder="+54 11 ..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Mensaje</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                                    placeholder="Cuéntanos sobre tu evento..."
                                ></textarea>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className="btn btn-gold w-full md:w-auto min-w-[200px]"
                                >
                                    {status.loading ? (
                                        <span>Enviando...</span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Enviar Mensaje <Send size={16} />
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="text-center pt-20 border-t border-gray-100 mt-20">
                    <p className="text-sm text-text-light">
                        &copy; {new Date().getFullYear()} Romina Ferraretto. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
