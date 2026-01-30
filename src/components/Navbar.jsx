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
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', href: '/', type: 'route' },
        { name: 'Sobre Nosotros', href: '#about', type: 'hash' },
        { name: 'Servicios', href: '#services', type: 'hash' },
        { name: 'Productos', href: '/productos', type: 'route' },
        { name: 'Testimonios', href: '#testimonials', type: 'hash' },
        { name: 'Contacto', href: '#contact', type: 'hash' },
    ];

    const handleLinkClick = (link) => {
        setIsOpen(false);
        if (link.type === 'hash' && location.pathname !== '/') {
            // If we're not on home page and clicking a hash link, go to home first
            window.location.href = '/' + link.href;
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : 'bg-gradient-to-b from-black/60 to-transparent py-6'}`}>
            <div className="container flex justify-between items-center">
                {/* Logo */}
                <div className="logo relative z-50">
                    <Link to="/" className={`font-serif text-2xl tracking-widest uppercase transition-colors ${scrolled || isOpen ? 'text-dark' : 'text-white'}`}>
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
                                className={`text-sm tracking-widest uppercase transition-colors hover:text-gold ${scrolled ? 'text-dark' : 'text-white'}`}
                            >
                                {link.name}
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => handleLinkClick(link)}
                                className={`text-sm tracking-widest uppercase transition-colors hover:text-gold ${scrolled ? 'text-dark' : 'text-white'}`}
                            >
                                {link.name}
                            </a>
                        )
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden relative z-50">
                    <button onClick={() => setIsOpen(!isOpen)} className={`transition-colors ${scrolled || isOpen ? 'text-dark' : 'text-white'}`}>
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
                                    className="text-dark text-2xl font-serif tracking-widest uppercase hover:text-gold transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    href={link.href}
                                    className="text-dark text-2xl font-serif tracking-widest uppercase hover:text-gold transition-colors"
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
