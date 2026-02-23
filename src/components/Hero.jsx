import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { PEARL_ASCII, LANGUAGES_BG_ASCII } from '../assets/data/ascii';

gsap.registerPlugin(ScrollTrigger);

const WORDS = {
  line1: ['Seoa'],
  line2: ['Mo'],
};

// Utility for randomness
const rand = (min, max) => Math.random() * (max - min) + min;

function LetterDisplay({ word }) {
  if (!word) return null;
  return word.split('').map((ch, i) => (
    <div
      key={i}
      className={`letter group relative inline-flex items-center justify-center
      font-playfair font-bold tracking-tighter
      text-[clamp(6rem,14vw,14rem)]
      cursor-default select-none
      `}
      data-speed={rand(0.8, 1.03)}
    >
      <span
        className="letter-inner relative z-10 text-rust"
        style={{ WebkitTextStroke: '1.5px transparent' }}
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    </div>
  ));
}

const Hero = () => {
  const box = useRef(null);
  const [showScroll, setShowScroll] = useState(true);

  useLayoutEffect(() => {
    if (!box.current) return;

    const ctx = gsap.context(() => {
      box.current.querySelectorAll('.letter').forEach((el) => {
        const innerSpan = el.querySelector('.letter-inner');
        const speed = parseFloat(el.dataset.speed);

        const shouldFade = Math.random() > 0.55; 

        let yPos = (1 - speed) * 0.5 * ScrollTrigger.maxScroll(window);
        if (yPos > 350) yPos = 350;

        const animVars = {
          y: yPos,
          rotation: rand(-12, 12),
          ease: 'power2.out',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 0,
            end: window.innerHeight,
            scrub: 0.5,
            invalidateOnRefresh: true,
          }
        };

        gsap.to(el, animVars);

        if (shouldFade && innerSpan) {
          gsap.to(innerSpan, {
            color: 'transparent',
            webkitTextStrokeColor: '#C4440A', 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 0,
              end: window.innerHeight / 1.35,
              scrub: 0.5,
              invalidateOnRefresh: true,
            }
          });
        }
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
    { number: '1.2k', label: 'RedNote followers grown from zero' },
    { number: '345%', label: 'Engagement growth' },
    { number: 'DeltaHacks XII', label: 'Swift Student Challenge Winner', isSmall: true },
  ];

  return (
    <section 
      ref={box}
      className="min-h-screen relative flex flex-col items-center justify-center pt-32 pb-24 overflow-visible bg-cream"
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

        <div className="relative leading-none">
          <div className="flex flex-wrap justify-center">
            <LetterDisplay word={WORDS.line1[0]} />
          </div>
          <div className="flex flex-wrap justify-center mt-[-0.1em]">
            <LetterDisplay word={WORDS.line2[0]} />
          </div>

          {/* PEARL_ASCII - Aligned to bottom right of text */}
          <div className="pearl-wrapper absolute bottom-[-0.05em] right-[-1.2em] md:right-[-1.5em] z-0 select-none hidden sm:block">
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
          Third-year Political Science & Economics student at McMaster University. I build at the intersection of coordination, digital delivery, and creative execution.
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
