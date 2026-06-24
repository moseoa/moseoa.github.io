import React, { useState } from 'react';
import Icon from './Icon';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-16 py-4 md:py-6 flex justify-between items-center bg-cream/85 backdrop-blur-md border-b border-border">
      <span className="font-mono text-[0.8rem] uppercase tracking-[0.15em] text-muted">
        Seoa Mo
      </span>
      
      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-10 list-none items-center">
        <li><a href="#projects" className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-muted no-underline transition-colors hover:text-rust">Work</a></li>
        <li><a href="#about" className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-muted no-underline transition-colors hover:text-rust">About</a></li>
        <li><a href="#contact" className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-muted no-underline transition-colors hover:text-rust">Contact</a></li>
        
        <div className="flex gap-4 items-center pl-6 border-l border-border ml-2">
          <a href="https://github.com/moseoa" target="_blank" rel="noreferrer" className="text-muted hover:text-rust transition-colors">
            <Icon name="github" size={18} />
          </a>
          <a href="https://linkedin.com/in/moseoa" target="_blank" rel="noreferrer" className="text-muted hover:text-rust transition-colors">
            <Icon name="linkedin" size={18} />
          </a>
        </div>
      </ul>

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMenu}
        className="block md:hidden text-muted hover:text-rust transition-colors focus:outline-none z-50"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-full left-0 right-0 bg-cream/95 backdrop-blur-md border-b border-border px-8 py-8 flex flex-col gap-6 shadow-lg md:hidden overflow-hidden"
          >
            <ul className="flex flex-col gap-5 list-none">
              <li>
                <a 
                  href="#projects" 
                  onClick={toggleMenu}
                  className="block font-mono text-[0.8rem] uppercase tracking-[0.15em] text-muted no-underline transition-colors hover:text-rust"
                >
                  Work
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={toggleMenu}
                  className="block font-mono text-[0.8rem] uppercase tracking-[0.15em] text-muted no-underline transition-colors hover:text-rust"
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={toggleMenu}
                  className="block font-mono text-[0.8rem] uppercase tracking-[0.15em] text-muted no-underline transition-colors hover:text-rust"
                >
                  Contact
                </a>
              </li>
            </ul>
            <div className="flex gap-6 items-center pt-6 border-t border-border/80">
              <a 
                href="https://github.com/moseoa" 
                target="_blank" 
                rel="noreferrer" 
                className="text-muted hover:text-rust transition-colors flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.15em]"
              >
                <Icon name="github" size={18} /> GitHub
              </a>
              <a 
                href="https://linkedin.com/in/moseoa" 
                target="_blank" 
                rel="noreferrer" 
                className="text-muted hover:text-rust transition-colors flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.15em]"
              >
                <Icon name="linkedin" size={18} /> LinkedIn
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
