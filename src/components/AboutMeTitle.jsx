import React, { useEffect, useRef, useState, useCallback } from 'react';
import sheetSrc from '../assets/images/about-me-delta.png';

const FRAME_W = 760;
const FRAME_H = 286;
const COLS = 4;
const TOTAL_FRAMES = 15;
const FRAME_INTERVAL_MS = 65; // ~15 fps (~1.0s crisp handwriting animation)

const AboutMeTitle = ({ className = '' }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sheetRef = useRef(null);
  const rafRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const [ready, setReady] = useState(false);

  const drawFrameDelta = useCallback((ctx, sheet, frameIndex) => {
    const col = frameIndex % COLS;
    const row = Math.floor(frameIndex / COLS);
    ctx.drawImage(
      sheet,
      col * FRAME_W,
      row * FRAME_H,
      FRAME_W,
      FRAME_H,
      0,
      0,
      FRAME_W,
      FRAME_H
    );
  }, []);

  const drawAllFrames = useCallback(() => {
    const canvas = canvasRef.current;
    const sheet = sheetRef.current;
    if (!canvas || !sheet) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    for (let i = 0; i < TOTAL_FRAMES; i += 1) {
      drawFrameDelta(ctx, sheet, i);
    }
  }, [drawFrameDelta]);

  const playAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    const sheet = sheetRef.current;
    if (!canvas || !sheet) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawAllFrames();
      return;
    }

    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    let startTime = null;
    let drawnFrames = 0;

    const tick = (now) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const targetFrames = Math.min(
        TOTAL_FRAMES,
        Math.floor(elapsed / FRAME_INTERVAL_MS) + 1
      );

      while (drawnFrames < targetFrames) {
        drawFrameDelta(ctx, sheet, drawnFrames);
        drawnFrames += 1;
      }

      if (drawnFrames < TOTAL_FRAMES) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [drawAllFrames, drawFrameDelta]);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      sheetRef.current = img;
      setReady(true);
    };
    img.src = sheetSrc;

    return () => {
      cancelled = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            playAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ready, playAnimation]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center select-none ${className}`}
    >
      <h2 className="sr-only">About Me</h2>
      <button
        type="button"
        onClick={() => ready && playAnimation()}
        aria-label="About Me — click to replay handwriting animation"
        title="Click to replay"
        className="block bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F66BA]/40 rounded"
      >
        <canvas
          ref={canvasRef}
          width={FRAME_W}
          height={FRAME_H}
          className="block w-[min(70vw,280px)] sm:w-[320px] md:w-[350px] h-auto aspect-[760/286] bg-transparent pointer-events-none"
        />
      </button>
    </div>
  );
};

export default AboutMeTitle;
