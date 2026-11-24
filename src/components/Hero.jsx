import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import SketchbookTitle from './SketchbookTitle';
import FloatingTrinkets from './FloatingTrinkets';
import ViewSketchesButton from './ViewSketchesButton';

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ readyToAnimate = true }) => {
  const box = useRef(null);
  const [showScroll, setShowScroll] = useState(true);

  useLayoutEffect(() => {
    if (!box.current) return;

    const ctx = gsap.context(() => {
      gsap.to('.sketchbook-title', {
        y: 60,
        opacity: 0.25,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: window.innerHeight,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    }, box);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handler = () => setShowScroll(window.scrollY < 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const stats = [
    { number: '2025', label: 'KPMG Canada Intern' },
    { number: '2026', label: 'Federal Government Intern' },
    { number: 'DeltaHacks XII', label: 'Swift Student Challenge Winner', isSmall: true },
  ];

  return (
    <section
      id="home"
      ref={box}
      className="min-h-[76vh] relative flex flex-col items-center justify-center pt-14 md:pt-16 pb-10 md:pb-12 overflow-x-hidden"
    >
      {/* Scattered Interactive Floating Trinkets */}
      <FloatingTrinkets />

      <div className="relative z-[1] flex flex-col items-center text-center gap-8 md:gap-10 px-8">
        <div className="relative leading-none flex items-center justify-center">
          <SketchbookTitle active={readyToAnimate} className="relative z-10" />
        </div>

        <div className="flex gap-16 items-center justify-center flex-wrap opacity-0 animate-[fadeUp_0.9s_ease_1.05s_forwards]">
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              <div className="text-center">
                <div className={`font-playfair text-ink leading-none mb-1 ${stat.isSmall ? 'text-[1.1rem]' : 'text-[2rem]'}`}>
                  {stat.number}
                </div>
                <div className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-muted max-w-[160px]">
                  {stat.label}
                </div>
              </div>
              {index < stats.length - 1 && (
                <div className="hidden md:block w-px h-10 bg-border" />
              )}
            </React.Fragment>
          ))}
        </div>

        <ViewSketchesButton href="#projects" active={readyToAnimate} />
      </div>

      {/* Modern Scroll Indicator */}
      <div
        className={`
          absolute bottom-3 left-1/2 -translate-x-1/2
          flex items-center gap-3
          transition-all duration-500 ease-out
          ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <span className="text-xs font-mono font-bold tracking-widest text-muted uppercase">
          Scroll
        </span>
        <ChevronDown
          size={16}
          className="text-muted animate-bounce"
        />
      </div>
    </section>
  );
};

export default Hero;
