import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const bannerModules = import.meta.glob('../assets/images/banner/*.jpg', {
  eager: true,
  import: 'default',
});

const BANNER_PHOTOS = Object.entries(bannerModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src], index) => ({
    id: path,
    src,
    alt: `Seoa sketchbook moment ${index + 1}`,
  }));

const TILTS = [
  '-rotate-[1.4deg]',
  'rotate-[1.1deg]',
  '-rotate-[0.7deg]',
  'rotate-[1.5deg]',
  '-rotate-[1.1deg]',
  'rotate-[0.8deg]',
];

const PhotoBanner = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (!selectedPhoto) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedPhoto]);

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
            onClick={() => setSelectedPhoto(photo)}
            aria-label={`View ${photo.alt}`}
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
      className="relative w-full py-10 md:py-14 bg-cream border-t border-border/70 overflow-hidden"
    >
      {/* Edge fade masks so photos glide cleanly into the cream paper */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-cream via-cream/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-cream via-cream/70 to-transparent"
      />

      {/* Infinite marquee track (pauses on hover) */}
      <div className="group w-full overflow-hidden py-3">
        <div className="flex w-max animate-banner-loop group-hover:[animation-play-state:paused]">
          {renderTrack('primary', false)}
          {renderTrack('clone', true)}
        </div>
      </div>

      {/* Lightbox preview when a photo is clicked */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1E2A5E]/70 backdrop-blur-sm p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90vw] max-h-[86vh] p-2.5 sm:p-3 bg-white rounded-2xl border-2 border-[#9ED4F7] shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo preview"
              className="absolute -top-4 -right-4 w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#4F66BA] text-white border-2 border-[#2E4085] hover:bg-[#3F55A8] transition-colors cursor-pointer shadow-md"
            >
              <X size={17} strokeWidth={2.4} />
            </button>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="max-w-[84vw] max-h-[78vh] w-auto h-auto rounded-xl block object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoBanner;
