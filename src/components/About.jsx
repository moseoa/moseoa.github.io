import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, X } from 'lucide-react';
import { PROFILE_BG_ASCII } from '../assets/data/ascii';
import resumePdf from '../assets/resume/SeoaMo_Resume.pdf';

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

  const skills = [
    { name: 'Languages', value: 'Mandarin · Korean · French' },
    { name: 'Design', value: 'Adobe Creative Suite · SwiftUI' },
    { name: 'Technical', value: 'Python · SQL · R · Jira' },
    { name: 'Office', value: 'Excel · PowerPoint · SAP' },
    { name: 'Education', value: 'McMaster University · 2027' },
    { name: 'Certificate', value: 'CFA Foundations · IBM H&OS' },
  ];

  return (
    <section id="about" className="px-16 py-32 border-t border-border grid grid-cols-1 lg:grid-cols-2 gap-24 items-start relative overflow-hidden bg-cream">
      {/* Background ASCII Art */}
      <div className="absolute top-0 left-0 w-[150%] h-full pointer-events-none select-none opacity-[0.05] overflow-hidden flex flex-wrap content-start z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-ink">
            {PROFILE_BG_ASCII}
          </pre>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-6 mb-10">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-rust">About</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="text-[1rem] leading-[1.9] text-muted space-y-6">
          <p>
            I am a third-year <strong className="text-ink font-medium">Political Science and Economics</strong> student at McMaster University (graduating 2027). My academic background trains me to understand how institutions, incentives, and people interact.
          </p>
          <p>
            Last summer I interned at <strong className="text-ink font-medium">KPMG Canada</strong> as a Management Consultant in Operations, where I coordinated cross-functional workstreams and delivered executive-ready recommendations.
          </p>
          <p>
            I am fluent in <strong className="text-ink font-medium">Mandarin and Korean</strong>, and comfortable across technical tooling from Python and SQL to Adobe Creative Suite.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => setIsCvOpen(true)}
            className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink border border-ink px-5 py-3 bg-transparent transition-colors hover:bg-rust hover:border-rust hover:text-cream cursor-pointer"
          >
            <FileText size={14} />
            View CV / Resume
          </button>

          <a
            href={resumePdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted no-underline border-b border-border pb-1 transition-colors hover:text-rust hover:border-rust"
          >
            Open in new tab
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-6 mb-10">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-rust">Skills</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className={`p-6 border-b border-border ${index % 2 === 0 ? 'border-r sm:border-r' : 'sm:border-r-0'}`}
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted mb-2">{skill.name}</p>
              <p className="font-playfair text-[1rem] text-ink">{skill.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CV Preview Modal */}
      {isCvOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setIsCvOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl h-[85vh] bg-cream border border-border flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-cream">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-rust">
                  Curriculum Vitae
                </span>
                <span className="font-playfair text-[0.95rem] text-ink hidden sm:inline">
                  — Seoa Mo
                </span>
              </div>

              <div className="flex items-center gap-5">
                <a
                  href={resumePdf}
                  download="SeoaMo_Resume.pdf"
                  className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-muted no-underline transition-colors hover:text-rust"
                >
                  <Download size={13} />
                  Download
                </a>
                <a
                  href={resumePdf}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-muted no-underline transition-colors hover:text-rust"
                >
                  <ExternalLink size={13} />
                  New Tab
                </a>
                <button
                  type="button"
                  onClick={() => setIsCvOpen(false)}
                  aria-label="Close CV preview"
                  className="text-muted hover:text-rust transition-colors p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-ink/5 relative">
              <iframe
                src={resumePdf}
                title="Seoa Mo Resume"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;
