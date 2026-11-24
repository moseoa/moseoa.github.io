import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import AboutMeTitle from './AboutMeTitle';
import resumePdf from '../assets/resume/SeoaMo_Resume.pdf';
import headshotSrc from '../assets/images/seoa-headshot.jpg';
import starSrc from '../assets/images/trinket-star.png';

const About = () => {
  const [isCvOpen, setIsCvOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCvOpen(false);
    };
    if (isCvOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCvOpen]);

  return (
    <section
      id="about"
      className="px-6 md:px-16 py-10 sm:py-14 md:py-20 relative overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20">
        {/* Left: Circular framed headshot in blue, navy & white */}
        <div className="relative shrink-0">
          {/* Subtle hand-drawn star accent */}
          <img
            src={starSrc}
            alt=""
            aria-hidden="true"
            draggable="false"
            className="pointer-events-none select-none absolute -top-5 -right-4 w-11 sm:w-12 h-auto rotate-12 opacity-90 z-10"
          />

          <div
            className="w-[240px] h-[240px] sm:w-[290px] sm:h-[290px] md:w-[320px] md:h-[320px] rounded-full p-2 bg-white border-[5px] border-[#4F66BA] overflow-hidden"
            style={{
              boxShadow: '6px 7px 0px #9ED4F7, 0 12px 30px rgba(30, 42, 94, 0.12)',
            }}
          >
            <img
              src={headshotSrc}
              alt="Seoa Mo headshot"
              draggable="false"
              className="w-full h-full rounded-full object-cover object-center block"
            />
          </div>
        </div>

        {/* Right: Animated About Me title, Resume pill + circular social buttons, simple bio */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[460px]">
          <AboutMeTitle className="-ml-1 mb-4" />

          {/* Resume pill + circular GitHub, LinkedIn, Email icons (blue, navy blue, white) */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-7">
            <motion.button
              type="button"
              onClick={() => setIsCvOpen(true)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96, y: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#4F66BA] text-white border-[2.5px] border-[#1E2A5E] font-sans font-extrabold lowercase text-[1.02rem] leading-none tracking-[-0.01em] hover:bg-[#3F55A8] transition-colors cursor-pointer"
              style={{ boxShadow: '3px 4px 0px #9ED4F7' }}
            >
              resume!
            </motion.button>

            <motion.a
              href="https://github.com/moseoa"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95, y: 1 }}
              className="w-11 h-11 rounded-full bg-white text-[#1E2A5E] border-[2.5px] border-[#1E2A5E] hover:bg-[#4F66BA] hover:text-white transition-colors inline-flex items-center justify-center"
              style={{ boxShadow: '2.5px 3.5px 0px #9ED4F7' }}
            >
              <Icon name="github" size={20} />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/seoamo/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95, y: 1 }}
              className="w-11 h-11 rounded-full bg-white text-[#1E2A5E] border-[2.5px] border-[#1E2A5E] hover:bg-[#4F66BA] hover:text-white transition-colors inline-flex items-center justify-center"
              style={{ boxShadow: '2.5px 3.5px 0px #9ED4F7' }}
            >
              <Icon name="linkedin" size={20} />
            </motion.a>

            <motion.a
              href="mailto:inquiriesseoamo@gmail.com"
              aria-label="Email Seoa"
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95, y: 1 }}
              className="w-11 h-11 rounded-full bg-white text-[#1E2A5E] border-[2.5px] border-[#1E2A5E] hover:bg-[#4F66BA] hover:text-white transition-colors inline-flex items-center justify-center"
              style={{ boxShadow: '2.5px 3.5px 0px #9ED4F7' }}
            >
              <Mail size={19} strokeWidth={2.3} />
            </motion.a>
          </div>

          {/* Super simple, clean intro & add-ons matching reference layout */}
          <div className="text-[1.02rem] leading-[1.8] text-[#3A4A7C] space-y-4">
            <p>
              hey! i&apos;m seoa, a{' '}
              <strong className="font-semibold text-[#1E2A5E]">
                multi-disciplinary fourth-year political science student @ mcmaster university
              </strong>{' '}
              specializing in public law &amp; judicial studies passionate about public policy, technology, and design. Thanks for stopping by my sketchbook!
            </p>

            <div className="pt-1">
              <p className="italic text-[#5B6FA8] mb-2">add-ons:</p>
              <ul className="list-none space-y-1.5 font-medium text-[#1E2A5E]">
                <li>✦ minor in economics</li>
                <li>✦ fluent in mandarin, korean &amp; english</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CV / Resume Preview Modal */}
      <AnimatePresence>
        {isCvOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1E2A5E]/60 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setIsCvOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative w-full max-w-4xl h-[86dvh] bg-white rounded-2xl border-2 border-[#4F66BA] flex flex-col shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEEFF] bg-[#F4F8FD]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#4F66BA] font-medium">
                    Curriculum Vitae
                  </span>
                  <span className="font-playfair text-[0.95rem] text-[#1E2A5E] hidden sm:inline">
                    — Seoa Mo
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  <a
                    href={resumePdf}
                    download="SeoaMo_Resume.pdf"
                    className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[#3A4A7C] no-underline transition-colors hover:text-[#4F66BA]"
                  >
                    <Download size={13} />
                    Download
                  </a>
                  <a
                    href={resumePdf}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[#3A4A7C] no-underline transition-colors hover:text-[#4F66BA]"
                  >
                    <ExternalLink size={13} />
                    New Tab
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsCvOpen(false)}
                    aria-label="Close CV preview"
                    className="w-8 h-8 rounded-full bg-white text-[#1E2A5E] border border-[#C7E4FA] hover:bg-[#4F66BA] hover:text-white hover:border-[#1E2A5E] transition-colors inline-flex items-center justify-center cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full bg-[#EAF3FB]/40 relative">
                <iframe
                  src={resumePdf}
                  title="Seoa Mo Resume"
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
