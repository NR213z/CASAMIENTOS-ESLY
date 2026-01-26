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
            <div className="relative z-20 px-4 fade-in">
                <h2 className="text-xl md:text-2xl tracking-[0.3em] uppercase mb-4 text-gold-light">
                    Romina Ferraretto
                </h2>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight">
                    Experiencias <br />
                    <span className="italic text-gold">Inolvidables</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl font-light mb-10 text-off-white">
                    Organización integral de eventos sociales y corporativos extraordinarios.
                </p>
                <a href="#contact" className="btn btn-gold">
                    Contactanos
                </a>
            </div>
        </section>
    );
};

export default Hero;
