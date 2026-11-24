import React, { useState } from 'react';
import { ArrowUpRight, Heart, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ClosingTitle from './ClosingTitle';
import Icon from './Icon';
import grabSketch1 from '../assets/images/grab-sketch-1.jpg';
import grabSketch2 from '../assets/images/grab-sketch-2.jpg';
import grabSketch3 from '../assets/images/grab-sketch-3.jpg';

const TORN_CLIPS = [
  'polygon(1.6% 2.1%, 9.2% 0.8%, 18.4% 2.3%, 28.1% 0.9%, 39.5% 2.2%, 51.2% 0.7%, 63.4% 2.0%, 74.8% 0.8%, 85.9% 2.2%, 95.4% 1.1%, 98.8% 3.4%, 97.9% 14.2%, 99.3% 26.5%, 97.8% 39.1%, 99.2% 52.4%, 98.0% 66.2%, 99.1% 79.4%, 97.9% 92.3%, 95.2% 98.8%, 85.1% 97.6%, 73.6% 99.1%, 61.9% 97.7%, 49.4% 99.2%, 37.8% 97.8%, 25.6% 99.1%, 14.3% 97.6%, 3.1% 98.7%, 0.9% 91.2%, 2.2% 78.4%, 0.8% 64.9%, 2.1% 51.3%, 0.7% 37.8%, 2.0% 24.6%, 0.9% 11.8%)',
  'polygon(2.1% 1.4%, 11.4% 2.4%, 22.8% 0.8%, 34.1% 2.1%, 46.5% 0.7%, 58.2% 2.3%, 70.4% 0.9%, 82.1% 2.2%, 93.2% 0.9%, 98.6% 2.8%, 99.2% 15.8%, 97.8% 28.4%, 99.3% 41.9%, 97.9% 55.2%, 99.1% 69.1%, 98.0% 82.6%, 98.7% 96.4%, 89.2% 99.1%, 77.5% 97.6%, 65.1% 99.2%, 52.8% 97.7%, 40.4% 99.1%, 28.2% 97.5%, 16.4% 99.0%, 3.5% 97.8%, 0.8% 88.4%, 2.1% 75.1%, 0.7% 61.8%, 2.2% 48.2%, 0.8% 34.9%, 2.1% 21.5%, 0.9% 9.4%)',
  'polygon(1.4% 1.9%, 10.6% 0.7%, 20.9% 2.3%, 31.8% 0.9%, 43.2% 2.2%, 55.1% 0.8%, 66.8% 2.4%, 78.4% 0.8%, 89.1% 2.1%, 97.9% 1.4%, 99.1% 12.6%, 97.9% 25.8%, 99.4% 39.2%, 98.0% 53.1%, 99.2% 66.8%, 97.8% 80.2%, 98.9% 94.6%, 91.4% 98.9%, 79.8% 97.5%, 67.6% 99.2%, 55.4% 97.8%, 43.1% 99.1%, 30.8% 97.6%, 18.6% 99.2%, 5.2% 97.8%, 0.9% 89.8%, 2.2% 76.2%, 0.7% 62.5%, 2.0% 49.1%, 0.8% 35.4%, 2.1% 22.1%, 0.9% 9.8%)',
];

const INITIAL_SKETCHES = [
  {
    id: 'sketch-3',
    src: grabSketch3,
    alt: 'Graphite nose study sketch',
    rotate: -6,
    offsetX: -14,
    offsetY: 6,
    clip: TORN_CLIPS[2],
  },
  {
    id: 'sketch-2',
    src: grabSketch2,
    alt: 'Graphite tilted portrait sketch',
    rotate: 5,
    offsetX: 12,
    offsetY: -2,
    clip: TORN_CLIPS[1],
  },
  {
    id: 'sketch-1',
    src: grabSketch1,
    alt: 'Graphite eyepatch portrait sketch',
    rotate: -2.5,
    offsetX: 0,
    offsetY: -8,
    clip: TORN_CLIPS[0],
  },
];

const ScallopedEdge = ({ flip = false }) => (
  <svg
    viewBox="0 0 320 12"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={`w-full h-3 block text-white ${flip ? 'rotate-180' : ''}`}
  >
    <path
      fill="currentColor"
      d="M0,12 L0,6 Q8,0 16,6 T32,6 T48,6 T64,6 T80,6 T96,6 T112,6 T128,6 T144,6 T160,6 T176,6 T192,6 T208,6 T224,6 T240,6 T256,6 T272,6 T288,6 T304,6 T320,6 L320,12 Z"
    />
  </svg>
);

const Contact = () => {
  const [sketches, setSketches] = useState(INITIAL_SKETCHES);
  const [likedRows, setLikedRows] = useState({});

  const remaining = sketches.length;
  const grabbed = INITIAL_SKETCHES.length - remaining;

  const handleGrabSketch = () => {
    if (sketches.length === 0) return;
    setSketches((prev) => prev.slice(0, -1));
  };

  const handleRestock = () => {
    setSketches(INITIAL_SKETCHES);
  };

  const toggleLike = (key) => {
    setLikedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const summaryRows = [
    { key: 'projects', count: 4, label: 'projects' },
    { key: 'experiences', count: 3, label: 'experiences' },
    { key: 'interests', count: 3, label: 'interests' },
    { key: 'grabbed', count: grabbed, label: 'sketches grabbed' },
  ];

  return (
    <footer id="contact" className="px-4 sm:px-8 md:px-14 pt-12 pb-16 md:pb-20">
      <div
        className="max-w-5xl mx-auto rounded-[2rem] bg-[#F4F8FD]/90 border-[2.5px] border-[#C7E4FA] px-6 sm:px-10 md:px-14 py-12 md:py-16"
        style={{
          boxShadow: '6px 7px 0px #DCEEFF',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 items-center">
          {/* Left column: Animated Thank You title + Interactive Grab a Sketch stack */}
          <div className="flex flex-col items-center text-center">
            <ClosingTitle className="mb-3" />

            {/* Interactive sketch stack */}
            <div className="relative w-[220px] sm:w-[250px] h-[195px] flex items-center justify-center mt-2">
              {/* Stack of 3 clickable torn graphite sketches */}
              <div className="relative w-[170px] h-[175px] flex items-center justify-center">
                <AnimatePresence>
                  {sketches.map((sketch, index) => {
                    const isTop = index === sketches.length - 1;
                    return (
                      <motion.button
                        key={sketch.id}
                        type="button"
                        onClick={isTop ? handleGrabSketch : undefined}
                        initial={{
                          opacity: 0,
                          scale: 0.85,
                          x: sketch.offsetX,
                          y: sketch.offsetY - 12,
                          rotate: sketch.rotate,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: sketch.offsetX,
                          y: sketch.offsetY,
                          rotate: sketch.rotate,
                        }}
                        exit={{
                          opacity: 0,
                          y: -75,
                          x: index % 2 === 0 ? 55 : -55,
                          rotate: index % 2 === 0 ? 18 : -18,
                          scale: 0.72,
                          transition: { duration: 0.34, ease: 'easeIn' },
                        }}
                        whileHover={
                          isTop
                            ? { y: sketch.offsetY - 10, scale: 1.06, rotate: 0 }
                            : undefined
                        }
                        whileTap={isTop ? { scale: 0.95 } : undefined}
                        transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                        aria-label={
                          isTop
                            ? `Grab ${sketch.alt} (${remaining} remaining)`
                            : sketch.alt
                        }
                        disabled={!isTop}
                        className={`absolute inset-0 bg-transparent border-0 p-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F66BA]/60 rounded ${
                          isTop ? 'cursor-pointer' : 'pointer-events-none'
                        }`}
                        style={{
                          zIndex: index + 1,
                          filter:
                            'drop-shadow(0 6px 12px rgba(30,42,94,0.16)) drop-shadow(0 1px 3px rgba(30,42,94,0.1))',
                        }}
                      >
                        <div
                          className="w-full h-full overflow-hidden bg-[#F4EFE6]"
                          style={{ clipPath: sketch.clip }}
                        >
                          <img
                            src={sketch.src}
                            alt={sketch.alt}
                            draggable="false"
                            className="w-full h-full object-cover block"
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Dynamic helper / empty state text */}
            <div className="mt-2 min-h-[28px] flex items-center justify-center gap-2.5">
              {remaining > 0 ? (
                <p className="font-mono text-[0.72rem] tracking-[0.06em] text-[#5B6FA8]">
                  click to grab a sketch ({remaining} left)
                </p>
              ) : (
                <>
                  <p className="font-mono text-[0.76rem] tracking-[0.05em] text-[#3A4A7C]">
                    no more sketches...
                  </p>
                  <button
                    type="button"
                    onClick={handleRestock}
                    aria-label="Restock the 3 sketches"
                    className="inline-flex items-center gap-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#4F66BA] hover:text-[#1E2A5E] bg-white border border-[#C7E4FA] px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                  >
                    <RotateCcw size={11} />
                    restock
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right column: Scalloped "TOTAL DRAWINGS" ticket card in blue, navy & white */}
          <div className="flex justify-center">
            <div className="w-full max-w-[355px] drop-shadow-[0_10px_24px_rgba(30,42,94,0.08)]">
              <ScallopedEdge />

              <div className="relative bg-white px-7 sm:px-8 py-7 text-[#1E2A5E]">
                {/* Side ticket punch notches */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F4F8FD] border-r-[2px] border-[#9ED4F7]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F4F8FD] border-l-[2px] border-[#9ED4F7]"
                />

                <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] font-semibold text-[#5B6FA8] pb-4 border-b border-dashed border-[#C7E4FA]">
                  total drawings
                </p>

                <ul className="list-none divide-y divide-dashed divide-[#C7E4FA]">
                  {summaryRows.map((row) => {
                    const isLiked = !!likedRows[row.key];
                    return (
                      <li
                        key={row.key}
                        className="py-3.5 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-mono text-[0.95rem] font-semibold text-[#4F66BA] tabular-nums">
                            {row.count} ×
                          </span>
                          <span className="font-playfair text-[1.1rem] text-[#1E2A5E]">
                            {row.label}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleLike(row.key)}
                          aria-label={`Favorite ${row.label}`}
                          className="p-1 text-[#4F66BA] hover:scale-110 transition-transform cursor-pointer bg-transparent border-0"
                        >
                          <Heart
                            size={16}
                            strokeWidth={2}
                            fill={isLiked ? '#4F66BA' : 'none'}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Send me a message pill CTA */}
                <div className="pt-5 border-t border-dashed border-[#C7E4FA]">
                  <motion.a
                    href="mailto:inquiriesseoamo@gmail.com"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98, y: 1 }}
                    className="w-full inline-flex items-center justify-between px-5 py-3 rounded-full bg-[#4F66BA] text-white border-[2.5px] border-[#1E2A5E] font-sans font-extrabold lowercase text-[0.98rem] tracking-[-0.01em] no-underline hover:bg-[#3F55A8] transition-colors"
                    style={{ boxShadow: '3px 4px 0px #9ED4F7' }}
                  >
                    <span>send me a message!</span>
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  </motion.a>

                  <p className="mt-4 text-center font-mono text-[0.72rem] text-[#5B6FA8]">
                    email: inquiriesseoamo@gmail.com
                  </p>

                  <div className="mt-3 flex items-center justify-center gap-4">
                    <a
                      href="https://github.com/moseoa"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="text-[#5B6FA8] hover:text-[#1E2A5E] transition-colors"
                    >
                      <Icon name="github" size={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/seoamo/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="text-[#5B6FA8] hover:text-[#1E2A5E] transition-colors"
                    >
                      <Icon name="linkedin" size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <ScallopedEdge flip />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center font-mono text-[0.68rem] tracking-[0.08em] text-[#5B6FA8]/80">
        © 2026 Seoa Mo · hand-drawn sketches and made with love &lt;3
      </p>
    </footer>
  );
};

export default Contact;
