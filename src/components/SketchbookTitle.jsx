import React, { useEffect, useRef, useState, useCallback } from 'react';
import sheet1Src from '../assets/images/sketchbook-delta-1.png';
import sheet2Src from '../assets/images/sketchbook-delta-2.png';

const FRAME_W = 960;
const FRAME_H = 632;
const COLS = 4;
const FRAMES_PER_SHEET = 20;
const TOTAL_FRAMES = 35;
const FRAME_INTERVAL_MS = 62.5; // ~16 fps matching original recording (~2.2s total)
const START_DELAY_MS = 180;

const SketchbookTitle = ({ className = '' }) => {
  const canvasRef = useRef(null);
  const sheetsRef = useRef(null);
  const rafRef = useRef(null);
  const [ready, setReady] = useState(false);

  const drawFrameDelta = useCallback((ctx, sheets, frameIndex) => {
    const sheetIndex = frameIndex < FRAMES_PER_SHEET ? 0 : 1;
    const localIndex = frameIndex < FRAMES_PER_SHEET ? frameIndex : frameIndex - FRAMES_PER_SHEET;
    const col = localIndex % COLS;
    const row = Math.floor(localIndex / COLS);

    ctx.drawImage(
      sheets[sheetIndex],
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
    const sheets = sheetsRef.current;
    if (!canvas || !sheets) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    for (let i = 0; i < TOTAL_FRAMES; i += 1) {
      drawFrameDelta(ctx, sheets, i);
    }
  }, [drawFrameDelta]);

  const playAnimation = useCallback((initialDelay = START_DELAY_MS) => {
    const canvas = canvasRef.current;
    const sheets = sheetsRef.current;
    if (!canvas || !sheets) return;

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
      if (startTime === null) {
        startTime = now + initialDelay;
      }

      const elapsed = now - startTime;
      if (elapsed >= 0) {
        const targetFrames = Math.min(
          TOTAL_FRAMES,
          Math.floor(elapsed / FRAME_INTERVAL_MS) + 1
        );

        while (drawnFrames < targetFrames) {
          drawFrameDelta(ctx, sheets, drawnFrames);
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

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([loadImage(sheet1Src), loadImage(sheet2Src)])
      .then((sheets) => {
        if (cancelled) return;
        sheetsRef.current = sheets;
        setReady(true);
      })
      .catch(() => {
        // Ignore load errors if component unmounted or asset unavailable
      });

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

  const handleReplay = () => {
    if (ready) {
      playAnimation(0);
    }
  };

  return (
    <div
      className={`sketchbook-title relative inline-flex items-center justify-center select-none ${className}`}
    >
      <h1 className="sr-only">Seoa&apos;s Sketchbook</h1>
      <button
        type="button"
        onClick={handleReplay}
        aria-label="Seoa's Sketchbook — click to replay handwriting animation"
        title="Click to replay"
        className="group relative block bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rust/40 rounded"
      >
        <canvas
          ref={canvasRef}
          width={FRAME_W}
          height={FRAME_H}
          className="block w-[min(86vw,540px)] sm:w-[min(76vw,620px)] md:w-[min(68vw,680px)] h-auto aspect-[960/632] bg-transparent pointer-events-none"
        />
      </button>
    </div>
  );
};

export default SketchbookTitle;
