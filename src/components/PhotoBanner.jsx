import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Undo2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BANNER_CAPTIONS, DEFAULT_BANNER_CAPTION } from '../assets/data/bannerCaptions';
import cinnamorollSrc from '../assets/images/trinket-cinnamoroll.png';
import bunnySrc from '../assets/images/trinket-bunny.png';
import starSrc from '../assets/images/trinket-star.png';
import bowSrc from '../assets/images/trinket-bow.png';

const STORAGE_KEY = 'seoa_sketchbook_photo_stickers_v1';

const STICKER_OPTIONS = [
  { id: 'cinnamoroll', label: 'Cinnamoroll', src: cinnamorollSrc, widthPct: 24, thumbClass: 'w-11' },
  { id: 'bunny', label: 'Bunny', src: bunnySrc, widthPct: 16, thumbClass: 'w-7' },
  { id: 'star', label: 'Star', src: starSrc, widthPct: 13, thumbClass: 'w-7' },
  { id: 'bow', label: 'Ribbon Bow', src: bowSrc, widthPct: 18, thumbClass: 'w-8' },
];

const STICKER_BY_ID = Object.fromEntries(STICKER_OPTIONS.map((s) => [s.id, s]));

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

const loadStoredStickers = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const PhotoBanner = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedStickerId, setSelectedStickerId] = useState('star');
  const [stickersByPhoto, setStickersByPhoto] = useState(loadStoredStickers);
  const [draggingId, setDraggingId] = useState(null);
  const photoStageRef = useRef(null);
  const dragMovedRef = useRef(false);

  const selectedPhoto =
    selectedIndex !== null ? BANNER_PHOTOS[selectedIndex] : null;
  const activeStickers = selectedPhoto
    ? stickersByPhoto[selectedPhoto.filename] || []
    : [];

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stickersByPhoto));
    } catch {
      // Ignore storage quota or private-mode errors
    }
  }, [stickersByPhoto]);

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

  const handleStageClick = (e) => {
    if (!selectedPhoto || !selectedStickerId || !photoStageRef.current) return;
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    if (e.target.closest('[data-placed-sticker="true"]')) return;

    const rect = photoStageRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const xPct = Math.max(6, Math.min(94, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(6, Math.min(94, ((e.clientY - rect.top) / rect.height) * 100));
    const rotate = Math.round((Math.random() - 0.5) * 22);

    const newSticker = {
      uid: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      stickerId: selectedStickerId,
      x: xPct,
      y: yPct,
      rotate,
    };

    setStickersByPhoto((prev) => ({
      ...prev,
      [selectedPhoto.filename]: [...(prev[selectedPhoto.filename] || []), newSticker],
    }));
  };

  const handleStickerPointerDown = (e, uid) => {
    e.stopPropagation();
    if (e.target.closest('[data-remove-sticker="true"]')) return;
    setDraggingId(uid);
    dragMovedRef.current = false;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleStickerPointerMove = (e, uid) => {
    if (draggingId !== uid || !selectedPhoto || !photoStageRef.current) return;
    const rect = photoStageRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    dragMovedRef.current = true;
    const xPct = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(4, Math.min(96, ((e.clientY - rect.top) / rect.height) * 100));

    setStickersByPhoto((prev) => ({
      ...prev,
      [selectedPhoto.filename]: (prev[selectedPhoto.filename] || []).map((item) =>
        item.uid === uid ? { ...item, x: xPct, y: yPct } : item
      ),
    }));
  };

  const handleStickerPointerUp = (e) => {
    if (draggingId) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      setDraggingId(null);
    }
  };

  const handleRemoveSticker = (uid) => {
    if (!selectedPhoto) return;
    setStickersByPhoto((prev) => ({
      ...prev,
      [selectedPhoto.filename]: (prev[selectedPhoto.filename] || []).filter(
        (item) => item.uid !== uid
      ),
    }));
  };

  const handleUndoSticker = () => {
    if (!selectedPhoto) return;
    setStickersByPhoto((prev) => {
      const list = prev[selectedPhoto.filename] || [];
      if (!list.length) return prev;
      return {
        ...prev,
        [selectedPhoto.filename]: list.slice(0, -1),
      };
    });
  };

  const handleClearStickers = () => {
    if (!selectedPhoto) return;
    setStickersByPhoto((prev) => ({
      ...prev,
      [selectedPhoto.filename]: [],
    }));
  };

  const renderTrack = (trackKey, isDuplicate = false) => (
    <div
      key={trackKey}
      aria-hidden={isDuplicate || undefined}
      className="flex shrink-0 items-center gap-5 pr-5"
    >
      {BANNER_PHOTOS.map((photo, idx) => {
        const tilt = TILTS[idx % TILTS.length];
        const placed = stickersByPhoto[photo.filename] || [];
        return (
          <button
            key={`${trackKey}-${photo.id}`}
            type="button"
            tabIndex={isDuplicate ? -1 : 0}
            onClick={() => setSelectedIndex(idx)}
            aria-label={`View ${photo.title}`}
            className={`group/card relative shrink-0 p-2 bg-white border border-[#DCEEFF] rounded-xl shadow-[0_6px_18px_rgba(46,64,133,0.07)] transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F66BA]/50 ${tilt} hover:rotate-0 hover:-translate-y-1.5 hover:border-[#9ED4F7] hover:shadow-[0_14px_28px_rgba(79,102,186,0.16)]`}
          >
            <div className="relative overflow-hidden rounded-lg bg-[#EAF3FB]">
              <img
                src={photo.src}
                alt={isDuplicate ? '' : photo.alt}
                loading={idx < 8 && !isDuplicate ? 'eager' : 'lazy'}
                decoding="async"
                draggable="false"
                className="h-[190px] sm:h-[225px] md:h-[255px] w-auto max-w-[340px] object-cover block select-none transition-transform duration-500 group-hover/card:scale-[1.03]"
              />
              {/* Show any stickers decorated onto this photo */}
              {placed.map((item) => {
                const def = STICKER_BY_ID[item.stickerId];
                if (!def) return null;
                return (
                  <img
                    key={`${trackKey}-${item.uid}`}
                    src={def.src}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    className="pointer-events-none absolute select-none drop-shadow-[0_2px_4px_rgba(26,23,20,0.22)]"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: `${def.widthPct}%`,
                      transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
                    }}
                  />
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      aria-label="Photo moments gallery"
      className="relative w-full py-2 md:py-4 overflow-hidden"
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

      {/* Lightbox preview with description & interactive sticker decorating */}
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
              className="relative w-full max-w-4xl max-h-[92dvh] bg-white rounded-2xl border-2 border-[#9ED4F7] shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
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

              {/* Left column: Photo sticker canvas + Sticker tray */}
              <div className="relative flex-1 bg-[#F4F8FD] flex flex-col items-center justify-between p-4 sm:p-6 gap-4 min-h-[240px] md:max-h-[86dvh] shrink-0">
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                  <div
                    ref={photoStageRef}
                    data-sticker-stage="true"
                    onClick={handleStageClick}
                    className={`relative inline-block max-w-full max-h-full rounded-xl overflow-hidden shadow-sm select-none ${
                      selectedStickerId ? 'cursor-crosshair' : 'cursor-default'
                    }`}
                  >
                    <img
                      src={selectedPhoto.src}
                      alt={selectedPhoto.alt}
                      draggable="false"
                      className="max-w-full max-h-[38vh] md:max-h-[62vh] w-auto h-auto rounded-xl block object-contain"
                    />

                    {/* Placed stickers (draggable, removable on hover) */}
                    {activeStickers.map((item) => {
                      const def = STICKER_BY_ID[item.stickerId];
                      if (!def) return null;
                      return (
                        <motion.div
                          key={item.uid}
                          data-placed-sticker="true"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 460, damping: 22 }}
                          onPointerDown={(e) => handleStickerPointerDown(e, item.uid)}
                          onPointerMove={(e) => handleStickerPointerMove(e, item.uid)}
                          onPointerUp={handleStickerPointerUp}
                          onPointerCancel={handleStickerPointerUp}
                          className="group/sticker absolute touch-none cursor-grab active:cursor-grabbing z-10"
                          style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            width: `${def.widthPct}%`,
                            transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
                          }}
                        >
                          <img
                            src={def.src}
                            alt={`${def.label} sticker`}
                            draggable="false"
                            className="w-full h-auto block select-none drop-shadow-[0_3px_6px_rgba(26,23,20,0.28)]"
                          />
                          <button
                            type="button"
                            data-remove-sticker="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSticker(item.uid);
                            }}
                            aria-label={`Remove ${def.label} sticker`}
                            className="opacity-0 group-hover/sticker:opacity-100 focus:opacity-100 absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#4F66BA] text-white border border-white flex items-center justify-center text-[10px] shadow cursor-pointer transition-opacity"
                          >
                            <X size={11} strokeWidth={2.5} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Sticker Tray */}
                <div className="w-full max-w-md bg-white/95 border border-[#C7E4FA] rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-[0_4px_14px_rgba(46,64,133,0.06)]">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#5B6FA8] mr-1 hidden sm:inline">
                      stickers
                    </span>
                    {STICKER_OPTIONS.map((sticker) => {
                      const isSelected = selectedStickerId === sticker.id;
                      return (
                        <button
                          key={sticker.id}
                          type="button"
                          onClick={() =>
                            setSelectedStickerId(isSelected ? null : sticker.id)
                          }
                          aria-label={`Select ${sticker.label} sticker`}
                          aria-pressed={isSelected}
                          title={`Click photo to place ${sticker.label}`}
                          className={`h-10 px-2 rounded-xl border transition-all duration-200 inline-flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-[#EAF5FF] border-[#4F66BA] ring-2 ring-[#9ED4F7]/70 scale-105'
                              : 'bg-cream/60 border-[#DCEEFF] hover:border-[#9ED4F7] hover:bg-[#EAF5FF]/60'
                          }`}
                        >
                          <img
                            src={sticker.src}
                            alt={sticker.label}
                            draggable="false"
                            className={`${sticker.thumbClass} max-h-8 h-auto object-contain block`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {activeStickers.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={handleUndoSticker}
                          aria-label="Undo last sticker"
                          title="Undo"
                          className="w-8 h-8 rounded-full bg-[#EAF5FF] text-[#4F66BA] border border-[#C7E4FA] hover:bg-[#4F66BA] hover:text-white transition-colors inline-flex items-center justify-center cursor-pointer"
                        >
                          <Undo2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={handleClearStickers}
                          aria-label="Clear stickers on this photo"
                          title="Clear stickers"
                          className="w-8 h-8 rounded-full bg-[#EAF5FF] text-[#4F66BA] border border-[#C7E4FA] hover:bg-[#4F66BA] hover:text-white transition-colors inline-flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
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

                  <p className="mt-5 font-mono text-[0.63rem] uppercase tracking-[0.14em] text-[#8DA3D6]">
                    {selectedStickerId
                      ? 'click the photo to place a sticker · drag to move'
                      : 'pick a sticker below to decorate this photo'}
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
