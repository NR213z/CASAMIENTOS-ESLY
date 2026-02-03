import React from 'react';

const Hero = () => {
    return (
        <section id="home" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>

            {/* Background Image (We will import this properly in a real setup, using inline style for now or img tag) */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero_bg.png"
                    alt="Wedding Venue"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 px-4">
                <h2 className="text-xl md:text-2xl tracking-[0.4em] uppercase mb-6 text-champagne-light fade-in-up stagger-1">
                    Romina Ferraretto
                </h2>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl mb-10 leading-tight fade-in-up stagger-2">
                    Experiencias <br />
                    <span className="italic gradient-text">Inolvidables</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl font-light mb-12 text-white/90 fade-in-up stagger-3 tracking-wide">
                    Planificación y diseño integral de eventos de lujo.
                </p>
                <div className="fade-in-up stagger-4">
                    <a href="#contact" className="btn btn-champagne">
                        Contactanos
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
