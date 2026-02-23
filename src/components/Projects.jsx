import React, { useEffect, useRef } from 'react';
import { PROJECTS_BG_ASCII } from '../assets/data/ascii';

const projects = [
  {
    id: 1,
    title: 'LavaLock',
    type: 'Hackathon / Product',
    subtitle: 'Swift Student Challenge Winner · DeltaHacks XII · 2026',
    desc: 'A cryptographic iOS password manager that transforms physical lava lamp entropy into secure passwords and 2FA codes. I owned branding, UX/UI design, and product direction — driving ideation to a deployable build in under 24 hours.',
    tags: ['Swift / SwiftUI', 'UX/UI Design', 'Branding', 'AWS', 'Gemini API'],
    link: 'https://devpost.com/software/lavalock',
    visualClass: 'lavalock-bg',
    isLava: true
  },
  {
    id: 2,
    title: 'RedNote @ McMaster',
    type: 'Content Strategy / Visual Design',
    subtitle: 'Communications Assistant · McMaster Student Recruitment · 2025–Present',
    desc: "Launched and scaled McMaster's first Chinese social media presence on RedNote (小红书) from zero. I taught myself Adobe Illustrator in one month and shipped real client-facing work — city-specific event posters.",
    tags: ['Adobe Creative Suite', 'Adobe Illustrator', 'Adobe Premiere Pro', 'Content Strategy', 'Data Analytics', 'Mandarin'],
    link: 'https://www.xiaohongshu.com/user/profile/67fa6a84000000000e011528?xsec_token=YBhjfkIRQbuD8hnDKpKfnuKaPN-JEFwJ4LoKeEuPYsHOo=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODxGQ0Q9SU02NzUyOTgwNjdHOTk0NTw8&apptime=1771889491&share_id=cab016e564364077a6b3869620cc9782',
    stats: '1.2k followers · 345% engagement growth · 1 month to ship',
    visualClass: 'rednote-bg',
    isRedNote: true
  }
];

const ProjectCard = ({ project }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, { threshold: 0.15 });

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border mb-12 opacity-0 translate-y-[30px] transition-all duration-700 ease-out even:md:flex-row-reverse"
    >
      <div className={`min-h-[480px] flex items-center justify-center overflow-hidden relative ${project.visualClass}`}>
        {project.isLava && (
          <>
            <div className="absolute rounded-full blur-[40px] animate-[float_6s_ease-in-out_infinite] w-[180px] h-[220px] bg-[radial-gradient(circle,#C4440A,#7A1A00)] top-[15%] left-[25%]" />
            <div className="absolute rounded-full blur-[40px] animate-[float_6s_ease-in-out_infinite] w-[140px] h-[160px] bg-[radial-gradient(circle,#E8620A,#C4440A)] top-[50%] left-[40%] delay-[-2s]" />
            <div className="absolute rounded-full blur-[40px] animate-[float_6s_ease-in-out_infinite] w-[100px] h-[130px] bg-[radial-gradient(circle,#C9A84C,#8A6A1A)] top-[65%] left-[20%] delay-[-4s]" />
          </>
        )}
        {project.isRedNote && (
          <>
            <div className="absolute w-full h-full bg-[#FE2C55]/10" />
            <div className="absolute rounded-full blur-[50px] animate-[float_8s_ease-in-out_infinite] w-[250px] h-[250px] bg-[#FE2C55]/20 top-[10%] left-[-10%]" />
            <div className="absolute rounded-full blur-[60px] animate-[float_10s_ease-in-out_infinite] w-[300px] h-[300px] bg-[#ffffff]/40 bottom-[-15%] right-[-10%] delay-[-3s]" />
            <div className="absolute w-[150%] h-[1px] bg-white/20 rotate-45 top-[20%] left-[-25%]" />
            <div className="absolute w-[150%] h-[1px] bg-white/20 rotate-45 top-[40%] left-[-25%]" />
            <div className="absolute w-[150%] h-[1px] bg-white/20 rotate-45 top-[60%] left-[-25%]" />
          </>
        )}
        <div className={`z-10 font-playfair text-2xl drop-shadow-lg ${project.isRedNote ? 'text-rust' : 'text-white'}`}>{project.title}</div>
      </div>

      <div className="p-14 flex flex-col justify-center bg-cream">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-rust mb-6">
          {project.id.toString().padStart(2, '0')} — {project.type}
        </p>
        <h2 className="font-playfair text-[2.2rem] leading-[1.15] tracking-[-0.02em] mb-4 text-ink">
          {project.title}
        </h2>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted mb-6">
          {project.subtitle}
        </p>
        <p className="text-[0.95rem] leading-[1.85] text-muted mb-8">
          {project.desc}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map(tag => (
            <span key={tag} className="font-mono text-[0.65rem] uppercase tracking-[0.1em] px-3.5 py-1.5 border border-border text-muted">
              {tag}
            </span>
          ))}
        </div>

        {project.stats && (
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-rust mb-8">
            {project.stats}
          </p>
        )}

        <a href={project.link || '#'} className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink no-underline border-b border-ink pb-1 transition-colors hover:text-rust hover:border-rust w-fit">
          View Work →
        </a>
      </div>
    </div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="px-16 py-32 border-t border-border relative overflow-hidden bg-cream">
      {/* Background ASCII Art */}
      <div className="absolute top-0 left-0 w-[150%] h-full pointer-events-none select-none opacity-[0.05] overflow-hidden flex flex-wrap content-start z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-ink">
            {PROJECTS_BG_ASCII}
          </pre>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-6 mb-16">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-rust">Selected Work</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
