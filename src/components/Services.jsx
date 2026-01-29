import React from 'react';
import { Heart, Briefcase, Calendar, Star, Users, Music } from 'lucide-react';

const Services = () => {
    const socialServices = [
        { title: 'Bodas', icon: Heart, desc: 'Celebra el amor con una boda inolvidable, cuidamos cada detalle.' },
        { title: 'Quince', icon: Star, desc: 'Hacé realidad el sueño de toda quinceañera con una fiesta espectacular.' },
        { title: 'Bat y Bar Mitzva', icon: Music, desc: 'Conmemora este importante rito de paso con una celebración significativa.' },
    ];

    const corporateServices = [
        { title: 'Fiestas de Fin de Año', icon: Calendar, desc: 'Experiencias inolvidables que despierten el asombro.' },
        { title: 'Lanzamientos', icon: Briefcase, desc: 'Eventos de impacto para presentar nuevos productos.' },
        { title: 'Team Building', icon: Users, desc: 'Jornadas de integración y motivación para equipos.' },
    ];

    return (
        <section id="services" className="section bg-off-white">
            <div className="container mx-auto px-4">
                {/* Social Events */}
                <div className="mb-20">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2 order-2 md:order-1">
                            <h2 className="text-left mb-6">Eventos Sociales</h2>
                            <p className="text-text-light mb-8">Hacemos de tu evento un momento inolvidable. Creamos recuerdos únicos con una celebración llena de alegría, música y diversión.</p>
                            <div className="grid grid-cols-1 gap-6">
                                {socialServices.map((service) => (
                                    <div key={service.title} className="card hover-lift flex items-start gap-4">
                                        <div className="text-gold mt-1"><service.icon size={28} /></div>
                                        <div>
                                            <h4 className="font-serif text-lg mb-2">{service.title}</h4>
                                            <p className="text-sm text-text-light">{service.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 order-1 md:order-2 image-overlay">
                            <img src="/services_social.png" alt="Eventos Sociales" className="w-full h-auto rounded-lg shadow-xl" />
                        </div>
                    </div>
                </div>

                {/* Corporate Events */}
                <div>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2 image-overlay">
                            <img src="/services_corporate.png" alt="Eventos Corporativos" className="w-full h-auto rounded-lg shadow-xl" />
                        </div>
                        <div className="w-full md:w-1/2">
                            <h2 className="text-left mb-6">Eventos Corporativos</h2>
                            <p className="text-text-light mb-8">Nos especializamos en la planificación, producción y diseño integral de eventos corporativos que impactan.</p>
                            <div className="grid grid-cols-1 gap-6">
                                {corporateServices.map((service) => (
                                    <div key={service.title} className="card hover-lift flex items-start gap-4">
                                        <div className="text-gold mt-1"><service.icon size={28} /></div>
                                        <div>
                                            <h4 className="font-serif text-lg mb-2">{service.title}</h4>
                                            <p className="text-sm text-text-light">{service.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
