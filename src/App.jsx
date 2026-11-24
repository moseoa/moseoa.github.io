import React, { useState, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import BlueGraphiteCursor from './components/BlueGraphiteCursor';
import SketchbookMenu from './components/SketchbookMenu';
import Hero from './components/Hero';
import PhotoBanner from './components/PhotoBanner';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import { LANGUAGES_BG_ASCII } from './assets/data/ascii';

function App() {
  const [introDone, setIntroDone] = useState(false);
  const handleLoaderComplete = useCallback(() => setIntroDone(true), []);

  return (
    <div className="min-h-[100dvh] relative bg-cream">
      <LoadingScreen onComplete={handleLoaderComplete} />
      <BlueGraphiteCursor />

      {/* Seamless full-page ASCII art background extending past dynamic mobile browser bars */}
      <div
        aria-hidden="true"
        className="fixed -top-28 -bottom-28 -left-6 w-[160%] pointer-events-none select-none opacity-[0.05] overflow-hidden flex flex-wrap content-start z-0"
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-ink">
            {LANGUAGES_BG_ASCII}
          </pre>
        ))}
      </div>

      {introDone && <SketchbookMenu />}
      <main
        className={
          introDone
            ? 'relative opacity-100 visible transition-opacity duration-300'
            : 'relative opacity-0 invisible pointer-events-none'
        }
      >
        <Hero readyToAnimate={introDone} />
        <PhotoBanner />
        <Projects />
        <About />
        <Contact />
      </main>
    </div>
  );
}

export default App;
