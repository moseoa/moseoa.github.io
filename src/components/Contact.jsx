import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="px-16 py-32 border-t border-border text-center">
      <h2 className="font-playfair text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.03em] mb-6">
        Let's work<br /><em className="italic text-rust">together</em>
      </h2>
      <p className="text-[1.1rem] text-muted mb-12 max-w-2xl mx-auto leading-[1.7]">
        Open to internship opportunities in project delivery, operations, and digital strategy.
      </p>
      <a 
        href="mailto:mochristina4@gmail.com" 
        className="font-playfair text-[1.5rem] text-ink no-underline border-b border-ink pb-1 transition-colors hover:text-rust hover:border-rust inline-block"
      >
        Get in touch
      </a>
    </section>
  );
};

export default Contact;
