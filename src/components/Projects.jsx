import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MySketchesTitle from './MySketchesTitle';
import TornSketchCard from './TornSketchCard';
import sketchProjectsSrc from '../assets/images/sketch-projects.jpg';
import sketchExperiencesSrc from '../assets/images/sketch-experiences.jpg';
import sketchInterestsSrc from '../assets/images/sketch-interests.jpg';

const projects = [
  {
    id: 1,
    title:
      "Does a Threshold-Based Diagnostic Consistency Framework for Women's Health Exist Within Family Physician Training in Canada?",
    type: 'Research / Policy',
    subtitle: 'Scoping Review',
    desc: 'Health Policy Work',
    tags: ['Health Policy', "Women's Health", 'Family Physician Training'],
    link: 'https://familymed.my.canva.site',
    isHealthPolicy: true,
  },
  {
    id: 2,
    title: 'LavaLock',
    type: 'Hackathon / Product',
    subtitle: 'Swift Student Challenge Winner · DeltaHacks XII · 2026',
    desc: 'A cryptographic iOS password manager that transforms physical lava lamp entropy into secure passwords and 2FA codes. I owned branding, UX/UI design, and product direction — driving ideation to a deployable build in under 24 hours.',
    tags: ['Swift / SwiftUI', 'UX/UI Design', 'Branding', 'AWS', 'Gemini API'],
    link: 'https://devpost.com/software/lavalock',
    isLava: true,
  },
  {
    id: 3,
    title: 'TeX-it',
    type: 'Hackathon / Product',
    subtitle: 'HackDaysinthe6ix · 2026',
    desc: 'An AI-powered LaTeX IDE where users can write documents using voice, files, or images of handwritten content. Powered by Deepgram speech-to-text and Gemini, it turns natural input into clean LaTeX — driving ideation to a deployable build in under 8 hours.',
    tags: ['deepgram', 'electron', 'gemini', 'go', 'react.js', 'typescript'],
    link: 'https://devpost.com/software/ltexch',
    isTexit: true,
  },
  {
    id: 4,
    title: 'RedNote @ McMaster',
    type: 'Content Strategy / Visual Design',
    subtitle: 'Communications Assistant · McMaster Student Recruitment · 2025–Present',
    desc: "Launched and scaled McMaster's first Chinese social media presence on RedNote (小红书) from zero. I taught myself Adobe Illustrator in one month and shipped real client-facing work — city-specific event posters.",
    tags: [
      'Adobe Creative Suite',
      'Adobe Illustrator',
      'Adobe Premiere Pro',
      'Content Strategy',
      'Data Analytics',
      'Mandarin',
    ],
    link: 'https://www.canva.com/design/DAHCMni_xlo/wB3IpNEtiJJmz8yHET0ooQ/edit?utm_content=DAHCMni_xlo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
    stats: '1.2k followers · 345% engagement growth · 1 month to ship',
    isRedNote: true,
  },
];

const experiences = [
  {
    id: 1,
    role: 'Legislative & Constituency Assistant Intern',
    org: 'House of Commons · Office of MP Aslam Rana',
    period: '2026 · Ottawa / Hamilton',
    desc: 'Supporting legislative affairs including researching and drafting committee questions, policy briefs, and constituency casework at the grassroots level.',
  },
  {
    id: 2,
    role: 'Management Consultant Intern — Operations (Healthcare Solutions)',
    org: 'KPMG Canada',
    period: 'Summer 2025 · Toronto',
    desc: 'Worked on a regional healthcare structural reform engagement to improve patient care quality and helped develop risk and mitigation frameworks for a provincial healthcare client.',
  },
  {
    id: 3,
    role: 'Communications Assistant',
    org: 'McMaster University Student Recruitment',
    period: '2025–Present · Hamilton',
    desc: "Launched and scaled McMaster's first Chinese social media presence on RedNote (小红书), creating city-specific event visuals and content strategy.",
  },
];

const interests = [
  {
    id: 1,
    title: 'Painting & Sketching',
    meta: 'Visual Art',
    desc: 'Acrylic paintings, graphite portraits, and hand-drawn sketches — including the artwork and animated titles throughout this sketchbook.',
  },
  {
    id: 2,
    title: 'Outdoors & Mountain Trails',
    meta: 'Adventure',
    desc: 'Hiking alpine passes, via ferrata climbing, and exploring the Canadian Rockies whenever I get the chance.',
  },
  {
    id: 3,
    title: 'Access to Justice & Public Policy',
    meta: 'Policy × Tech',
    desc: 'Exploring how technology, digital infrastructure, and thoughtful policy can expand access to justice and access to care.',
  },
];

const SKETCH_CARDS = [
  {
    key: 'projects',
    id: undefined,
    src: sketchProjectsSrc,
    alt: 'Hand-drawn graphite eye sketch labeled Projects',
    ariaLabel: 'Open projects popup',
    variant: 0,
    tiltClass: '-rotate-[2deg]',
  },
  {
    key: 'experiences',
    id: 'experiences',
    src: sketchExperiencesSrc,
    alt: 'Hand-drawn graphite portrait sketch labeled Experiences',
    ariaLabel: 'Open experiences popup',
    variant: 1,
    tiltClass: 'rotate-[1.4deg]',
  },
  {
    key: 'interests',
    id: 'interests',
    src: sketchInterestsSrc,
    alt: 'Hand-drawn graphite side-profile sketch labeled Interests',
    ariaLabel: 'Open interests popup',
    variant: 2,
    tiltClass: '-rotate-[1.5deg]',
    objectPositionClass: 'object-bottom',
  },
];

const ProjectPreviewCard = ({ project }) => (
  <div className="w-full md:w-[43%] shrink-0">
    <div className="relative aspect-[16/11] w-full rounded-2xl border-[2px] border-[#1E2A5E] bg-[#1A1D2E] overflow-hidden flex items-center justify-center -rotate-1 hover:rotate-0 transition-transform duration-300 shadow-[4px_5px_0_#C7E4FA]">
      {project.isLava && (
        <>
          <div className="absolute inset-0 bg-[#181210]" />
          <div className="absolute rounded-full blur-[34px] animate-[float_6s_ease-in-out_infinite] w-[140px] h-[170px] bg-[radial-gradient(circle,#C4440A,#7A1A00)] top-[10%] left-[20%]" />
          <div className="absolute rounded-full blur-[34px] animate-[float_6s_ease-in-out_infinite] w-[110px] h-[130px] bg-[radial-gradient(circle,#E8620A,#C4440A)] top-[45%] left-[42%] delay-[-2s]" />
          <div className="absolute rounded-full blur-[34px] animate-[float_6s_ease-in-out_infinite] w-[85px] h-[105px] bg-[radial-gradient(circle,#C9A84C,#8A6A1A)] top-[58%] left-[18%] delay-[-4s]" />
        </>
      )}

      {project.isRedNote && (
        <>
          <div className="absolute inset-0 bg-[#FFF4F6]" />
          <div className="absolute rounded-full blur-[40px] animate-[float_8s_ease-in-out_infinite] w-[200px] h-[200px] bg-[#FE2C55]/25 top-[-10%] left-[-10%]" />
          <div className="absolute rounded-full blur-[45px] animate-[float_10s_ease-in-out_infinite] w-[220px] h-[220px] bg-[#FFB3C1]/35 bottom-[-20%] right-[-10%] delay-[-3s]" />
          <div className="absolute w-[150%] h-[1px] bg-[#FE2C55]/15 rotate-45 top-[25%] left-[-25%]" />
          <div className="absolute w-[150%] h-[1px] bg-[#FE2C55]/15 rotate-45 top-[55%] left-[-25%]" />
        </>
      )}

      {project.isHealthPolicy && (
        <>
          <div className="absolute inset-0 bg-[#0D2B30]" />
          <div className="absolute rounded-full blur-[40px] animate-[float_8s_ease-in-out_infinite] w-[200px] h-[200px] bg-[#0F766E]/40 top-[-5%] left-[-10%]" />
          <div className="absolute rounded-full blur-[45px] animate-[float_10s_ease-in-out_infinite] w-[220px] h-[220px] bg-[#0EA5E9]/30 bottom-[-15%] right-[-10%] delay-[-3s]" />
          <div className="absolute w-[150%] h-[1px] bg-white/10 rotate-12 top-[25%] left-[-25%]" />
          <div className="absolute w-[150%] h-[1px] bg-white/10 rotate-12 top-[55%] left-[-25%]" />
          <div className="absolute w-[150%] h-[1px] bg-white/10 rotate-12 top-[80%] left-[-25%]" />
        </>
      )}

      {project.isTexit && (
        <>
          <div className="absolute inset-0 bg-[#1B254B]" />
          <div className="absolute rounded-full blur-[40px] animate-[float_7s_ease-in-out_infinite] w-[190px] h-[190px] bg-[#4F66BA]/45 top-[-10%] right-[-10%]" />
          <div className="absolute rounded-full blur-[45px] animate-[float_9s_ease-in-out_infinite] w-[200px] h-[200px] bg-[#8DD3F4]/30 bottom-[-20%] left-[-10%] delay-[-2s]" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#9ED4F7_1px,transparent_1px)] [background-size:16px_16px]" />
        </>
      )}

      <div
        className={`relative z-10 font-playfair font-bold text-lg sm:text-xl leading-snug px-6 text-center drop-shadow ${
          project.isRedNote ? 'text-rust' : 'text-white'
        }`}
      >
        {project.title.length > 52 ? `${project.title.slice(0, 52)}…` : project.title}
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [activeModal, setActiveModal] = useState(null); // 'projects' | 'experiences' | 'interests' | null

  const activeSketchCard = SKETCH_CARDS.find((card) => card.key === activeModal);

  useEffect(() => {
    const onOpenModal = (e) => {
      if (e.detail && ['projects', 'experiences', 'interests'].includes(e.detail)) {
        setActiveModal(e.detail);
      }
    };
    window.addEventListener('open-sketch-modal', onOpenModal);
    return () => window.removeEventListener('open-sketch-modal', onOpenModal);
  }, []);

  useEffect(() => {
    if (!activeModal) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  return (
    <section
      id="projects"
      className="px-6 md:px-16 pt-8 md:pt-12 pb-14 md:pb-20 relative overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Animated handwritten "my sketches" header */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-16">
          <MySketchesTitle />
        </div>

        {/* 3 torn-paper graphite sketches (labels live directly on the drawings) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-14 items-center justify-items-center">
          {SKETCH_CARDS.map((card) => (
            <TornSketchCard
              key={card.key}
              id={card.id}
              src={card.src}
              alt={card.alt}
              ariaLabel={card.ariaLabel}
              variant={card.variant}
              tiltClass={card.tiltClass}
              objectPositionClass={card.objectPositionClass}
              onClick={() => setActiveModal(card.key)}
            />
          ))}
        </div>
      </div>

      {/* Popup Modal (Projects / Experiences / Interests) */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeModal} list`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1E2A5E]/50 backdrop-blur-[3px] p-4 sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[88vh] bg-[#FBF9F4] rounded-3xl border-[2.5px] border-[#4F66BA] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Circular close button top-right */}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label={`Close ${activeModal} popup`}
                className="absolute top-5 right-5 z-20 w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/90 text-[#1E2A5E] border border-[#C7E4FA] hover:bg-[#4F66BA] hover:text-white hover:border-[#2E4085] transition-colors cursor-pointer shadow-sm"
              >
                <X size={18} strokeWidth={2.2} />
              </button>

              <div className="overflow-y-auto px-6 sm:px-12 py-10 sm:py-12">
                {/* Modal Top Torn Sketch Icon */}
                <div className="flex flex-col items-center text-center pb-8 mb-10 border-b border-[#DCEEFF]">
                  {activeSketchCard && (
                    <TornSketchCard
                      src={activeSketchCard.src}
                      alt={activeSketchCard.alt}
                      variant={activeSketchCard.variant}
                      tiltClass={activeSketchCard.tiltClass}
                      objectPositionClass={activeSketchCard.objectPositionClass}
                      compact
                    />
                  )}
                  <h3 className="sr-only">{activeModal}</h3>
                </div>

                {/* Projects list — matching reference 2-column row layout */}
                {activeModal === 'projects' && (
                  <div className="flex flex-col divide-y divide-[#DCEEFF]">
                    {projects.map((project, idx) => (
                      <article
                        key={project.id}
                        className={`flex flex-col md:flex-row items-center gap-8 md:gap-10 ${
                          idx === 0 ? 'pb-10' : 'py-10'
                        }`}
                      >
                        <ProjectPreviewCard project={project} />

                        <div className="flex-1 flex flex-col items-start text-left">
                          <p className="text-[0.8rem] text-[#5B6FA8] mb-2">
                            {project.type} · {project.subtitle}
                          </p>
                          <h4 className="font-playfair font-bold text-[1.55rem] sm:text-[1.85rem] leading-[1.2] text-[#1E2A5E] mb-3">
                            {project.title}
                          </h4>
                          <p className="text-[0.95rem] leading-[1.75] text-[#3A4A7C] mb-4">
                            {project.desc}
                          </p>

                          {project.stats && (
                            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#4F66BA] mb-4">
                              {project.stats}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mb-5">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[0.65rem] px-3 py-1 rounded-full bg-[#EAF5FF] border border-[#C7E4FA] text-[#3A4A7C]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <a
                            href={project.link || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#4F66BA] text-white border-[2px] border-[#2E4085] font-sans font-bold lowercase text-[0.9rem] no-underline hover:bg-[#3F55A8] transition-colors"
                            style={{ boxShadow: '2px 3px 0px #9ED4F7' }}
                          >
                            view project
                            <ArrowUpRight size={15} strokeWidth={2.5} />
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Experiences list */}
                {activeModal === 'experiences' && (
                  <div className="flex flex-col divide-y divide-[#DCEEFF]">
                    {experiences.map((exp, idx) => (
                      <article
                        key={exp.id}
                        className={idx === 0 ? 'pb-8' : 'py-8'}
                      >
                        <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-[#5B6FA8] mb-1.5">
                          {exp.period}
                        </p>
                        <h4 className="font-playfair font-bold text-[1.45rem] sm:text-[1.65rem] text-[#1E2A5E] leading-snug mb-1">
                          {exp.role}
                        </h4>
                        <p className="font-mono text-[0.75rem] text-[#4F66BA] mb-3">
                          {exp.org}
                        </p>
                        <p className="text-[0.95rem] leading-[1.75] text-[#3A4A7C]">
                          {exp.desc}
                        </p>
                      </article>
                    ))}
                  </div>
                )}

                {/* Interests list */}
                {activeModal === 'interests' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {interests.map((item) => (
                      <article
                        key={item.id}
                        className="p-6 rounded-2xl bg-white border border-[#DCEEFF] shadow-[0_4px_16px_rgba(46,64,133,0.05)]"
                      >
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#5B6FA8] mb-2">
                          {item.meta}
                        </p>
                        <h4 className="font-playfair font-bold text-[1.25rem] text-[#1E2A5E] mb-2.5">
                          {item.title}
                        </h4>
                        <p className="text-[0.9rem] leading-[1.7] text-[#3A4A7C]">
                          {item.desc}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
