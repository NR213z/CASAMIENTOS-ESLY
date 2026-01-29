import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', href: '#home' },
        { name: 'Sobre Nosotros', href: '#about' },
        { name: 'Servicios', href: '#services' },
        { name: 'Productos', href: '#products' },
        { name: 'Testimonios', href: '#testimonials' },
        { name: 'Contacto', href: '#contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
            <div className="container flex justify-between items-center">
                {/* Logo */}
                <div className="logo">
                    <a href="#" className={`font-serif text-2xl tracking-widest uppercase ${scrolled ? 'text-dark' : 'text-white'}`}>
                        Romina Ferraretto
                    </a>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-sm tracking-widest uppercase transition-colors hover:text-gold ${scrolled ? 'text-dark' : 'text-white'}`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className={scrolled ? 'text-dark' : 'text-white'}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
                    <ul className="flex flex-col p-6 space-y-4 text-center">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    className="text-dark text-sm tracking-widest uppercase hover:text-gold block py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
