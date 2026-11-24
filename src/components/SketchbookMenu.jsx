import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
      {/* Right-edge sketchbook menu tab */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            className="fixed top-7 right-0 z-[120] inline-flex items-center gap-2.5 pl-4 pr-5 py-2.5 rounded-l-md bg-cream/75 backdrop-blur-sm border-y border-l border-border/90 text-muted hover:text-rust hover:border-rust/60 hover:pr-6 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rust/40 shadow-[0_2px_12px_rgba(26,23,20,0.04)]"
          >
            <Menu size={15} strokeWidth={1.75} />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em]">
              menu
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expandable right-side menu drawer */}
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
              className="fixed inset-0 z-[130] bg-ink/15 backdrop-blur-[2px]"
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
              className="fixed top-0 right-0 bottom-0 z-[140] w-[min(86vw,340px)] bg-cream border-l border-border shadow-[-16px_0_48px_rgba(26,23,20,0.08)] flex flex-col justify-between p-8 sm:p-10 overflow-y-auto"
            >
              <div>
                {/* Drawer header */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-border/80">
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted">
                    menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation menu"
                    className="p-1.5 -mr-1.5 text-muted hover:text-rust transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rust/40 rounded"
                  >
                    <X size={18} strokeWidth={1.75} />
                  </button>
                </div>

                {/* Navigation tree */}
                <nav aria-label="Primary navigation" className="flex flex-col gap-5">
                  <a
                    href="#home"
                    onClick={(e) => handleNavigate(e, 'home')}
                    className={`group flex items-center justify-between font-playfair text-[1.6rem] leading-tight no-underline transition-colors ${
                      activeSection === 'home' ? 'text-rust' : 'text-ink hover:text-rust'
                    }`}
                  >
                    <span>home</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full bg-rust transition-opacity ${
                        activeSection === 'home' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                      }`}
                    />
                  </a>

                  <a
                    href="#about"
                    onClick={(e) => handleNavigate(e, 'about')}
                    className={`group flex items-center justify-between font-playfair text-[1.6rem] leading-tight no-underline transition-colors ${
                      activeSection === 'about' ? 'text-rust' : 'text-ink hover:text-rust'
                    }`}
                  >
                    <span>about</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full bg-rust transition-opacity ${
                        activeSection === 'about' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                      }`}
                    />
                  </a>

                  {/* Main header: my sketches */}
                  <div className="pt-5 mt-1 border-t border-border/80">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-playfair italic text-[1.35rem] leading-none text-rust">
                        my sketches
                      </span>
                      <div className="flex-1 h-px bg-border/70" />
                    </div>

                    <ul className="list-none pl-4 ml-1 border-l border-border flex flex-col gap-3.5">
                      {SKETCH_ITEMS.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              onClick={(e) => handleNavigate(e, item.id)}
                              className={`group flex items-center justify-between font-mono text-[0.78rem] uppercase tracking-[0.16em] no-underline transition-all duration-200 hover:translate-x-1 ${
                                isActive ? 'text-rust' : 'text-ink/80 hover:text-rust'
                              }`}
                            >
                              <span>{item.label}</span>
                              <span
                                className={`h-1 w-1 rounded-full bg-rust transition-opacity ${
                                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                                }`}
                              />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Contact */}
                  <div className="pt-5 mt-1 border-t border-border/80">
                    <a
                      href="#contact"
                      onClick={(e) => handleNavigate(e, 'contact')}
                      className={`group flex items-center justify-between font-playfair text-[1.6rem] leading-tight no-underline transition-colors ${
                        activeSection === 'contact' ? 'text-rust' : 'text-ink hover:text-rust'
                      }`}
                    >
                      <span>contact</span>
                      <span
                        className={`h-1.5 w-1.5 rounded-full bg-rust transition-opacity ${
                          activeSection === 'contact' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                        }`}
                      />
                    </a>
                  </div>
                </nav>
              </div>

              {/* Drawer footer links */}
              <div className="pt-8 mt-8 border-t border-border/80 flex flex-col gap-4">
                <a
                  href="mailto:inquiriesseoamo@gmail.com"
                  className="font-mono text-[0.7rem] tracking-[0.06em] text-muted hover:text-rust no-underline transition-colors truncate"
                >
                  inquiriesseoamo@gmail.com ↗
                </a>
                <div className="flex items-center gap-5">
                  <a
                    href="https://github.com/moseoa"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted hover:text-rust no-underline transition-colors"
                  >
                    <Icon name="github" size={16} />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/seoamo/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted hover:text-rust no-underline transition-colors"
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
