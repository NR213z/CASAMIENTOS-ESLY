import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const HomePage = () => {
    return (
        <div className="app">
            <Navbar />
            <Hero />
            <About />
            <Services />
            <Gallery />
            <Testimonials />
            <Contact />
        </div>
    );
};

export default HomePage;
