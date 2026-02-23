import React from 'react';
import { PROFILE_BG_ASCII } from '../assets/data/ascii';

const About = () => {
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
    </section>
  );
};

export default About;
