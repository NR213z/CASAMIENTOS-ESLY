import React from 'react';

const About = () => {
    return (
        <section id="about" className="section bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
                    {/* Image */}
                    <div className="w-full md:w-1/2">
                        <div className="relative image-overlay">
                            <div className="absolute top-4 left-4 w-full h-full border-2 border-champagne -z-10"></div>
                            <img
                                src="/about_img.png"
                                alt="Romina Ferraretto"
                                className="w-full h-auto rounded-lg shadow-xl"
                            />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-left mb-6">Sobre Nosotros</h2>
                        <div className="space-y-4 text-muted font-light text-lg">
                            <p>
                                <strong className="text-dark">Romina Ferraretto</strong> es reconocida por organizar las bodas más increíbles en Argentina.
                                Especialista en bodas destino, es considerada internacionalmente como una de las 150 “Top Destination Wedding Planners”
                                del mundo por el Destination Wedding Planners Congress “DWP”.
                            </p>
                            <p>
                                Bajo el lema <span className="italic text-champagne">“We Create, You Celebrate”</span>, la organización de sus eventos es única y exclusiva.
                                El resultado: verdaderas experiencias inolvidables para sus novios.
                            </p>
                            <p>
                                Con más de dos décadas de experiencia, Romina brinda servicios personalizados, destacando por su creatividad y exclusividad.
                                Su habilidad para fusionar estilos individuales con diseños visionarios garantiza celebraciones impecables y memorables.
                            </p>
                            <div className="pt-6">
                                <a href="#services" className="text-champagne uppercase tracking-[0.2em] text-xs font-semibold border-b border-champagne/40 hover:text-dark hover:border-dark transition-all">
                                    Conoce nuestros servicios
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
