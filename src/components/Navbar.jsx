import React from 'react';
import Icon from './Icon';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-16 py-6 flex justify-between items-center bg-cream/85 backdrop-blur-md border-b border-border">
      <span className="font-mono text-[0.8rem] uppercase tracking-[0.15em] text-muted">
        Seoa Mo
      </span>
      
      <ul className="flex gap-10 list-none items-center">
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
    </nav>
  );
};

export default Navbar;
