import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import useScrollSpy from '../hooks/useScrollSpy';

const SECTION_IDS = ['home', 'projects', 'experiences', 'interests', 'about', 'contact'];

const SKETCH_ITEMS = [
  { label: 'projects', id: 'projects' },
  { label: 'experiences', id: 'experiences' },
  { label: 'interests', id: 'interests' },
];

const SketchbookMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useScrollSpy(SECTION_IDS, 140);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavigate = (e, id) => {
    setIsOpen(false);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <>
      {/* Standout blue & white pill menu button on the top-right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.96, y: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            className="fixed top-6 right-6 z-[120] inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#4F66BA] text-white border-[2.5px] border-[#2E4085] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F66BA]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream transition-colors hover:bg-[#3F55A8]"
            style={{
              boxShadow: '3px 4px 0px #9ED4F7',
            }}
          >
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <line x1="2" y1="2.5" x2="18" y2="2.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="2" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="2" y1="13.5" x2="18" y2="13.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
            <span className="font-sans font-extrabold lowercase text-[1.05rem] leading-none tracking-[-0.01em]">
              menu
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expandable right-side blue & white menu drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Soft backdrop scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[130] bg-[#2E4085]/15 backdrop-blur-[2px]"
              aria-hidden="true"
            />

            {/* Sliding sketchbook panel */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[140] w-[min(86vw,340px)] bg-white border-l-[2.5px] border-[#4F66BA] shadow-[-16px_0_48px_rgba(46,64,133,0.14)] flex flex-col justify-between p-8 sm:p-10 overflow-y-auto"
            >
              <div>
                {/* Drawer header */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#DCEEFF]">
                  <span className="inline-flex items-center gap-2 font-sans font-bold lowercase text-[0.95rem] text-[#4F66BA] bg-[#EAF5FF] px-3.5 py-1 rounded-full border border-[#9ED4F7]">
                    menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation menu"
                    className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#EAF5FF] text-[#4F66BA] border-[1.5px] border-[#9ED4F7] hover:bg-[#4F66BA] hover:text-white hover:border-[#2E4085] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F66BA]/40"
                  >
                    <X size={17} strokeWidth={2.4} />
                  </button>
                </div>

                {/* Navigation tree */}
                <nav aria-label="Primary navigation" className="flex flex-col gap-5">
                  <a
                    href="#home"
                    onClick={(e) => handleNavigate(e, 'home')}
                    className={`group flex items-center justify-between font-playfair text-[1.6rem] leading-tight no-underline transition-colors ${
                      activeSection === 'home' ? 'text-[#4F66BA]' : 'text-[#1E2A5E] hover:text-[#4F66BA]'
                    }`}
                  >
                    <span>home</span>
                    <span
                      className={`h-2 w-2 rounded-full bg-[#4F66BA] transition-opacity ${
                        activeSection === 'home' ? 'opacity-100' : 'opacity-0 group-hover:opacity-45'
                      }`}
                    />
                  </a>

                  <a
                    href="#about"
                    onClick={(e) => handleNavigate(e, 'about')}
                    className={`group flex items-center justify-between font-playfair text-[1.6rem] leading-tight no-underline transition-colors ${
                      activeSection === 'about' ? 'text-[#4F66BA]' : 'text-[#1E2A5E] hover:text-[#4F66BA]'
                    }`}
                  >
                    <span>about</span>
                    <span
                      className={`h-2 w-2 rounded-full bg-[#4F66BA] transition-opacity ${
                        activeSection === 'about' ? 'opacity-100' : 'opacity-0 group-hover:opacity-45'
                      }`}
                    />
                  </a>

                  {/* Main header: my sketches */}
                  <div className="pt-5 mt-1 border-t border-[#DCEEFF]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-playfair italic font-semibold text-[1.35rem] leading-none text-[#4F66BA]">
                        my sketches
                      </span>
                      <div className="flex-1 h-px bg-[#C7E4FA]" />
                    </div>

                    <ul className="list-none pl-4 ml-1 border-l-2 border-[#C7E4FA] flex flex-col gap-3.5">
                      {SKETCH_ITEMS.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              onClick={(e) => handleNavigate(e, item.id)}
                              className={`group flex items-center justify-between font-mono text-[0.78rem] uppercase tracking-[0.16em] no-underline transition-all duration-200 hover:translate-x-1 ${
                                isActive ? 'text-[#4F66BA] font-medium' : 'text-[#3A4A7C] hover:text-[#4F66BA]'
                              }`}
                            >
                              <span>{item.label}</span>
                              <span
                                className={`h-1.5 w-1.5 rounded-full bg-[#6FAFE8] transition-opacity ${
                                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                                }`}
                              />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Contact */}
                  <div className="pt-5 mt-1 border-t border-[#DCEEFF]">
                    <a
                      href="#contact"
                      onClick={(e) => handleNavigate(e, 'contact')}
                      className={`group flex items-center justify-between font-playfair text-[1.6rem] leading-tight no-underline transition-colors ${
                        activeSection === 'contact' ? 'text-[#4F66BA]' : 'text-[#1E2A5E] hover:text-[#4F66BA]'
                      }`}
                    >
                      <span>contact</span>
                      <span
                        className={`h-2 w-2 rounded-full bg-[#4F66BA] transition-opacity ${
                          activeSection === 'contact' ? 'opacity-100' : 'opacity-0 group-hover:opacity-45'
                        }`}
                      />
                    </a>
                  </div>
                </nav>
              </div>

              {/* Drawer footer links */}
              <div className="pt-8 mt-8 border-t border-[#DCEEFF] flex flex-col gap-4">
                <a
                  href="mailto:inquiriesseoamo@gmail.com"
                  className="font-mono text-[0.7rem] tracking-[0.06em] text-[#5B6FA8] hover:text-[#2E4085] no-underline transition-colors truncate"
                >
                  inquiriesseoamo@gmail.com ↗
                </a>
                <div className="flex items-center gap-5">
                  <a
                    href="https://github.com/moseoa"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#5B6FA8] hover:text-[#2E4085] no-underline transition-colors"
                  >
                    <Icon name="github" size={16} />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/seoamo/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#5B6FA8] hover:text-[#2E4085] no-underline transition-colors"
                  >
                    <Icon name="linkedin" size={16} />
                    LinkedIn
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SketchbookMenu;
