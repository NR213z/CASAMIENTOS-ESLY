import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Florencia Pérez',
            text: 'Para nuestra boda necesitábamos una persona que se ocupara absolutamente de todos los detalles de la misma. Conocimos a Romina y no tuvimos que consultar a ninguna otra porque desde el primer encuentro nos dio la seguridad que queríamos.',
            date: '2019-04-01'
        },
        {
            name: 'Jen Gonzalez',
            text: 'Rule #1 don’t plan a wedding without a wedding planner. Rule #2 don’t plan your wedding without Romi and her team. Rule #3 it is totally worth every dollar. Romi and her team were A++.',
            date: '2024-06-26'
        },
        {
            name: 'Sol Espinosa',
            text: 'Romi nos acompañó en nuestro casamiento en octubre del 2021. Romi tuvo en cuenta cada cosa que pedimos, se adelantaba a nuestras necesidades. Nos quedamos con un hermoso recuerdo y una amiga querida.',
            date: '2021-10-01'
        },
        {
            name: 'Gabriela Salgado',
            text: 'Romi es una genia!! Hicimos un destination wedding con invitados de ecuador y brasil en el palacio sans souci, todo estuvo perfecto! No necesité estar presente para ningún detalle. 100% mi mejor inversión para tener paz mental!',
            date: '2024-06-25'
        }
    ];

    return (
        <section id="testimonials" className="section bg-white text-center">
            <div className="container mx-auto px-4">
                <h2 className="mb-12">Testimonios</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {testimonials.map((t, index) => (
                        <div key={index} className="card hover-lift text-left border border-border/40">
                            <div className="flex justify-center mb-6 text-champagne">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                            </div>
                            <p className="italic text-muted mb-6 text-center">"{t.text}"</p>
                            <h4 className="font-serif font-bold text-dark text-center">{t.name}</h4>
                            <span className="text-xs text-muted uppercase tracking-widest block text-center">{t.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
