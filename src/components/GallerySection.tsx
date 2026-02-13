import gallery1 from "@/assets/new_images/boda1.jpg";
import gallery2 from "@/assets/new_images/boda2.jpg";
import gallery3 from "@/assets/new_images/boda3.jpg";
import gallery4 from "@/assets/new_images/boda4.jpg";
import gallery5 from "@/assets/new_images/boda5.jpg";

const images = [
  { src: gallery1, alt: "Boda elegante", className: "md:col-span-1 md:row-span-2" },
  { src: gallery2, alt: "Celebración especial", className: "md:col-span-1" },
  { src: gallery3, alt: "Evento inolvidable", className: "md:col-span-1 md:row-span-2" },
  { src: gallery4, alt: "Detalle decorativo", className: "md:col-span-1" },
  { src: gallery5, alt: "Momento único", className: "md:col-span-1" },
];

const GallerySection = () => {
  return (
    <section id="galeria" className="py-24 md:py-32 bg-sand">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-section">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-body mb-3">
            Portfolio
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground">
            Nuestra <span className="italic">Galería</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[280px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`overflow-hidden group fade-in-section ${img.className}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
