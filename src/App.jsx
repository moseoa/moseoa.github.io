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
        className="fixed -top-12 -bottom-12 left-0 w-[150%] pointer-events-none select-none opacity-[0.05] overflow-hidden flex flex-wrap content-start z-0"
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-ink">
            {LANGUAGES_BG_ASCII}
          </pre>
        ))}
      </div>

      <SketchbookMenu />
      <main className="relative">
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
