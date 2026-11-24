import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BANNER_CAPTIONS, DEFAULT_BANNER_CAPTION } from '../assets/data/bannerCaptions';

const bannerModules = import.meta.glob('../assets/images/banner/*.jpg', {
  eager: true,
  import: 'default',
});

const BANNER_PHOTOS = Object.entries(bannerModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src], index) => {
    const filename = path.split('/').pop();
    const caption = BANNER_CAPTIONS[filename] || DEFAULT_BANNER_CAPTION;
    return {
      id: path,
      filename,
      src,
      alt: caption.title || `Seoa sketchbook moment ${index + 1}`,
      title: caption.title,
      meta: caption.meta,
      description: caption.description,
    };
  });

const TILTS = [
  '-rotate-[1.4deg]',
  'rotate-[1.1deg]',
  '-rotate-[0.7deg]',
  'rotate-[1.5deg]',
  '-rotate-[1.1deg]',
  'rotate-[0.8deg]',
];

const PhotoBanner = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selectedPhoto =
    selectedIndex !== null ? BANNER_PHOTOS[selectedIndex] : null;

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + BANNER_PHOTOS.length) % BANNER_PHOTOS.length
    );
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % BANNER_PHOTOS.length
    );
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, showPrev, showNext]);

  const renderTrack = (trackKey, isDuplicate = false) => (
    <div
      key={trackKey}
      aria-hidden={isDuplicate || undefined}
      className="flex shrink-0 items-center gap-5 pr-5"
    >
      {BANNER_PHOTOS.map((photo, idx) => {
        const tilt = TILTS[idx % TILTS.length];
        return (
          <button
            key={`${trackKey}-${photo.id}`}
            type="button"
            tabIndex={isDuplicate ? -1 : 0}
            onClick={() => setSelectedIndex(idx)}
            aria-label={`View ${photo.title}`}
            className={`group/card relative shrink-0 p-2 bg-white border border-[#DCEEFF] rounded-xl shadow-[0_6px_18px_rgba(46,64,133,0.07)] transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F66BA]/50 ${tilt} hover:rotate-0 hover:-translate-y-1.5 hover:border-[#9ED4F7] hover:shadow-[0_14px_28px_rgba(79,102,186,0.16)]`}
          >
            <div className="overflow-hidden rounded-lg bg-[#EAF3FB]">
              <img
                src={photo.src}
                alt={isDuplicate ? '' : photo.alt}
                loading={idx < 8 && !isDuplicate ? 'eager' : 'lazy'}
                decoding="async"
                draggable="false"
                className="h-[190px] sm:h-[225px] md:h-[255px] w-auto max-w-[340px] object-cover block select-none transition-transform duration-500 group-hover/card:scale-[1.03]"
              />
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      aria-label="Photo moments gallery"
      className="relative w-full py-10 md:py-14 overflow-hidden"
    >
      {/* Infinite marquee track with transparent edge fade mask so ASCII backdrop stays seamless */}
      <div
        className="group w-full overflow-hidden py-3"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div className="flex w-max animate-banner-loop group-hover:[animation-play-state:paused]">
          {renderTrack('primary', false)}
          {renderTrack('clone', true)}
        </div>
      </div>

      {/* Lightbox preview with caption & description when a photo is clicked */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1E2A5E]/70 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[88vh] bg-white rounded-2xl border-2 border-[#9ED4F7] shadow-2xl flex flex-col md:flex-row overflow-hidden"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close photo preview"
                className="absolute top-3.5 right-3.5 z-20 w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#4F66BA] text-white border-2 border-[#2E4085] hover:bg-[#3F55A8] transition-colors cursor-pointer shadow-md"
              >
                <X size={17} strokeWidth={2.4} />
              </button>

              {/* Photo pane */}
              <div className="relative flex-1 bg-[#F4F8FD] flex items-center justify-center p-4 sm:p-6 min-h-[260px] max-h-[54vh] md:max-h-[84vh]">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="max-w-full max-h-[48vh] md:max-h-[76vh] w-auto h-auto rounded-xl object-contain shadow-sm"
                />
              </div>

              {/* Description pane */}
              <div className="w-full md:w-[320px] lg:w-[350px] shrink-0 p-6 sm:p-8 md:pt-14 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-[#DCEEFF] overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[#5B6FA8]">
                      {selectedPhoto.meta}
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-[0.12em] text-[#8DA3D6] pr-8 md:pr-0">
                      {String(selectedIndex + 1).padStart(2, '0')} / {String(BANNER_PHOTOS.length).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="font-playfair text-[1.4rem] sm:text-[1.55rem] leading-snug text-[#1E2A5E] mb-4">
                    {selectedPhoto.title}
                  </h3>

                  <p className="text-[0.95rem] leading-[1.8] text-[#3A4A7C]">
                    {selectedPhoto.description}
                  </p>
                </div>

                {/* Prev / Next navigation */}
                <div className="mt-8 pt-5 border-t border-[#DCEEFF] flex items-center justify-between">
                  <span className="font-mono text-[0.62rem] text-[#8DA3D6]">
                    {selectedPhoto.filename}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={showPrev}
                      aria-label="Previous photo"
                      className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#EAF5FF] text-[#4F66BA] border border-[#9ED4F7] hover:bg-[#4F66BA] hover:text-white hover:border-[#2E4085] transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      aria-label="Next photo"
                      className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#EAF5FF] text-[#4F66BA] border border-[#9ED4F7] hover:bg-[#4F66BA] hover:text-white hover:border-[#2E4085] transition-colors cursor-pointer"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotoBanner;
