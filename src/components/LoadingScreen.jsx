import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import loaderSheetSrc from '../assets/images/loader-delta.png';

const FRAME_W = 760;
const FRAME_H = 218;
const COLS = 4;
const TOTAL_FRAMES = 32;
const FRAME_INTERVAL_MS = 56; // ~18 fps (~1.8s crisp loading animation)
const HOLD_AFTER_MS = 320;

const LoadingScreen = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const finishedRef = useRef(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setVisible(false);
      if (onComplete) onComplete();
    };

    // Respect reduced motion with a brief graceful fade
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timerRef.current = window.setTimeout(finish, 250);
      return () => window.clearTimeout(timerRef.current);
    }

    // Safety timeout so loading screen can never get stuck
    const safetyTimeout = window.setTimeout(finish, 4200);
    let cancelled = false;

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) {
        finish();
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        finish();
        return;
      }

      ctx.clearRect(0, 0, FRAME_W, FRAME_H);
      let startTime = null;
      let drawnFrames = 0;

      const tick = (now) => {
        if (cancelled) return;
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const targetFrames = Math.min(
          TOTAL_FRAMES,
          Math.floor(elapsed / FRAME_INTERVAL_MS) + 1
        );

        while (drawnFrames < targetFrames) {
          const col = drawnFrames % COLS;
          const row = Math.floor(drawnFrames / COLS);
          ctx.drawImage(
            img,
            col * FRAME_W,
            row * FRAME_H,
            FRAME_W,
            FRAME_H,
            0,
            0,
            FRAME_W,
            FRAME_H
          );
          drawnFrames += 1;
        }

        if (drawnFrames < TOTAL_FRAMES) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
          timerRef.current = window.setTimeout(finish, HOLD_AFTER_MS);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };
    img.onerror = finish;
    img.src = loaderSheetSrc;

    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimeout);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading Seoa's Sketchbook"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed -top-28 -bottom-28 -left-6 -right-6 z-[300] bg-cream flex flex-col items-center justify-center px-6 select-none"
        >
          <motion.div
            initial={{ opacity: 0.9, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4 }}
          >
            <canvas
              ref={canvasRef}
              width={FRAME_W}
              height={FRAME_H}
              className="block w-[min(82vw,340px)] sm:w-[390px] h-auto aspect-[760/218] bg-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
