import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { PEARL_ASCII, LANGUAGES_BG_ASCII } from '../assets/data/ascii';
import SketchbookTitle from './SketchbookTitle';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
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

      gsap.to('.pearl-wrapper', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: box.current,
          start: 'top top',
          end: '25% top',
          scrub: true
        }
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
      ref={box}
      className="min-h-screen relative flex flex-col items-center justify-center pt-32 pb-24 overflow-x-hidden bg-cream"
    >
      {/* Background ASCII Art */}
      <div className="absolute top-0 left-0 w-[150%] h-full pointer-events-none select-none opacity-[0.05] overflow-hidden flex flex-wrap content-start z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-ink">
            {LANGUAGES_BG_ASCII}
          </pre>
        ))}
      </div>

      <div className="relative z-[1] flex flex-col items-center text-center gap-12 px-8">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-rust"
        >
          Portfolio — 2026
        </motion.p>

        <div className="relative leading-none flex items-center justify-center">
          <SketchbookTitle className="relative z-10" />

          {/* PEARL_ASCII - Aligned to bottom right of text */}
          <div className="pearl-wrapper absolute bottom-[-0.05em] right-0 sm:right-[-1.2em] md:right-[-1.5em] z-0 select-none block">
            <div className="opacity-15 hover:opacity-100 transition-all duration-500 group cursor-crosshair">
              <pre className="text-[0.08em] md:text-[0.09em] leading-[0.8] font-mono text-muted group-hover:text-ink transition-all duration-300">
                {PEARL_ASCII}
              </pre>
            </div>
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1 }}
          className="text-[1.05rem] leading-[1.9] text-muted max-w-[520px]"
        >
          I am a Fourth-Year Political Science Student specializing in Public Law & Judicial Studies at McMaster University. I am passionate about Public Policy and how judicial systems can impact rights-related issues. I am currently on a team of 3 academics and professionals in the United Nations-Canada called I3 Alliance, where we are researching digital infrastructures that could decrease human trafficking. A lot of my work is rooted in my passion for technology and the use cases that exist with it, combined with my interest in Access to Justice and Access to Care. 
        </motion.p>

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

        <motion.a 
          href="#projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15 }}
          className="inline-flex items-center gap-3 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink no-underline border-b border-ink pb-1 transition-colors hover:text-rust hover:border-rust"
        >
          View selected work →
        </motion.a>
      </div>

      {/* Modern Scroll Indicator */}
      <div
        className={`
          absolute bottom-12 left-1/2 -translate-x-1/2
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
