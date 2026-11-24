import React from 'react';
import SketchbookMenu from './components/SketchbookMenu';
import Hero from './components/Hero';
import PhotoBanner from './components/PhotoBanner';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { LANGUAGES_BG_ASCII } from './assets/data/ascii';

function App() {
  return (
    <div className="min-h-screen relative bg-cream">
      {/* Seamless full-page ASCII art background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 w-[150%] h-full pointer-events-none select-none opacity-[0.05] overflow-hidden flex flex-wrap content-start z-0"
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-ink">
            {LANGUAGES_BG_ASCII}
          </pre>
        ))}
      </div>

      <SketchbookMenu />
      <main className="relative">
        <Hero />
        <PhotoBanner />
        <Projects />
        <About />
        <Contact />
      </main>
      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}

export default App;
