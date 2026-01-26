import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <Contact />
    </div>
  )
}

export default App
