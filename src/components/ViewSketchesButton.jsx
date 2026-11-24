import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import sheetSrc from '../assets/images/view-sketches-delta.png';

const FRAME_W = 560;
const FRAME_H = 345;
const COLS = 4;
const TOTAL_FRAMES = 24;
const FRAME_INTERVAL_MS = 62.5; // ~16 fps (~1.5s total)
const START_DELAY_MS = 1150; // Starts drawing smoothly right after hero intro fades in

const ViewSketchesButton = ({ href = '#projects', className = '' }) => {
  const canvasRef = useRef(null);
  const sheetRef = useRef(null);
  const rafRef = useRef(null);
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

  const playAnimation = useCallback((initialDelay = START_DELAY_MS) => {
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
      if (startTime === null) startTime = now + initialDelay;
      const elapsed = now - startTime;
      if (elapsed >= 0) {
        const targetFrames = Math.min(
          TOTAL_FRAMES,
          Math.floor(elapsed / FRAME_INTERVAL_MS) + 1
        );
        while (drawnFrames < targetFrames) {
          drawFrameDelta(ctx, sheet, drawnFrames);
          drawnFrames += 1;
        }
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
    if (ready) {
      playAnimation(START_DELAY_MS);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [ready, playAnimation]);

  const handleClick = (e) => {
    const id = href.replace(/^#/, '');
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', href);
    }
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => ready && playAnimation(0)}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 360, damping: 22 }}
      aria-label="View sketches"
      className={`inline-flex items-center justify-center bg-transparent no-underline select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F66BA]/50 rounded-lg ${className}`}
    >
      <canvas
        ref={canvasRef}
        width={FRAME_W}
        height={FRAME_H}
        className="block w-[165px] sm:w-[195px] md:w-[215px] h-auto aspect-[560/345] bg-transparent pointer-events-none"
      />
    </motion.a>
  );
};

export default ViewSketchesButton;
