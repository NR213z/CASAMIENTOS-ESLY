import React, { useState } from 'react';
import { X } from 'lucide-react';

const Gallery = () => {
    const [lightboxImage, setLightboxImage] = useState(null);

    const images = [
        { src: '/gallery/boda1.jpg', alt: 'Decoración de boda con flores blancas y candelabros', gridClass: 'md:col-span-2 md:row-span-2' },
        { src: '/gallery/boda2.jpg', alt: 'Detalle de mesa de bodas elegante', gridClass: 'md:col-span-1 md:row-span-1' },
        { src: '/gallery/boda3.jpg', alt: 'Salón de eventos con iluminación cálida', gridClass: 'md:col-span-1 md:row-span-1' },
        { src: '/gallery/boda4.jpg', alt: 'Ambientación de boda nocturna premium', gridClass: 'md:col-span-1 md:row-span-2' },
        { src: '/gallery/boda5.jpg', alt: 'Celebración de boda en gran salón decorado', gridClass: 'md:col-span-2 md:row-span-1' },
    ];

    return (
        <section id="gallery" className="section bg-off-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-dark mb-6">Galería de Eventos</h2>
                    <p className="text-xl text-text-light font-light leading-relaxed tracking-wide italic">
                        Detalles que trascienden el tiempo.
                    </p>
                </div>

                {/* Moodboard Grid Layout - Expanded Gap for Luxury Feel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`group relative overflow-hidden rounded-lg cursor-pointer ${image.gridClass}`}
                            onClick={() => setLightboxImage(image)}
                            style={{ minHeight: '250px' }}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                loading="lazy"
                            />
                            {/* Elegant Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                                <span className="text-white font-serif text-lg tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    Ver más
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 bg-dark/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        className="absolute top-8 right-8 text-white hover:text-champagne transition-colors"
                        onClick={() => setLightboxImage(null)}
                    >
                        <X size={32} strokeWidth={1.5} />
                    </button>
                    <img
                        src={lightboxImage.src}
                        alt={lightboxImage.alt}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default Gallery;
