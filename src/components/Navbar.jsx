import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', href: '/', type: 'route' },
        { name: 'Sobre Nosotros', href: '#about', type: 'hash' },
        { name: 'Servicios', href: '#services', type: 'hash' },
        { name: 'Galería', href: '#gallery', type: 'hash' },
        { name: 'Productos', href: '/productos', type: 'route' },
        { name: 'Testimonios', href: '#testimonials', type: 'hash' },
        { name: 'Contacto', href: '#contact', type: 'hash' },
    ];

    const handleLinkClick = (link) => {
        setIsOpen(false);
        if (link.type === 'hash' && location.pathname !== '/') {
            window.location.href = '/' + link.href;
        }
    };

    // Enhanced visibility: Stronger backdrop blur and semi-transparent bg
    const textColorClass = scrolled || isOpen ? 'text-dark' : 'text-white';
    const bgClass = scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-md py-4 border-b border-border'
        : 'bg-black/30 backdrop-blur-lg py-6';

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${bgClass}`}>
            <div className="container flex justify-between items-center">
                {/* Logo */}
                <div className="logo relative z-50">
                    <Link to="/" className={`font-serif text-2xl tracking-widest uppercase transition-colors ${textColorClass}`}>
                        Romina Ferraretto
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8">
                    {navLinks.map((link) => (
                        link.type === 'route' ? (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-sm tracking-widest uppercase transition-colors hover:text-champagne font-bold ${textColorClass}`}
                                style={!scrolled ? { textShadow: '0 2px 8px rgba(0,0,0,0.5)' } : {}}
                            >
                                {link.name}
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => handleLinkClick(link)}
                                className={`text-sm tracking-widest uppercase transition-colors hover:text-champagne font-bold ${textColorClass}`}
                                style={!scrolled ? { textShadow: '0 2px 8px rgba(0,0,0,0.5)' } : {}}
                            >
                                {link.name}
                            </a>
                        )
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden relative z-50">
                    <button onClick={() => setIsOpen(!isOpen)} className={`transition-colors ${textColorClass}`}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <ul className="flex flex-col space-y-8 text-center">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            {link.type === 'route' ? (
                                <Link
                                    to={link.href}
                                    className="text-dark text-2xl font-serif tracking-widest uppercase hover:text-champagne transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    href={link.href}
                                    className="text-dark text-2xl font-serif tracking-widest uppercase hover:text-champagne transition-colors"
                                    onClick={() => handleLinkClick(link)}
                                >
                                    {link.name}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
