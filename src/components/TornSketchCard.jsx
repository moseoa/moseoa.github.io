import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

// 3 distinct organic deckled / torn-paper polygon silhouettes
const TORN_CLIPS = [
  // Variant 0 (Projects)
  'polygon(1.2% 2.1%, 6.5% 0.8%, 12.4% 2.4%, 19.2% 1.1%, 26.8% 2.3%, 34.1% 0.7%, 42.3% 1.9%, 50.6% 0.6%, 58.2% 2.2%, 66.5% 0.9%, 74.1% 2.1%, 82.4% 0.8%, 89.7% 2.3%, 96.2% 1.0%, 98.9% 2.9%, 98.1% 9.5%, 99.4% 17.8%, 97.9% 26.4%, 99.3% 35.2%, 98.2% 44.1%, 99.5% 53.6%, 98.0% 62.3%, 99.2% 71.8%, 97.8% 80.5%, 99.1% 89.2%, 98.3% 96.8%, 95.8% 98.9%, 89.1% 97.6%, 81.6% 99.2%, 73.4% 97.9%, 65.2% 99.3%, 56.8% 97.8%, 48.5% 99.1%, 40.2% 97.6%, 31.9% 99.2%, 23.7% 97.8%, 15.4% 99.0%, 8.1% 97.5%, 2.4% 98.8%, 0.8% 93.4%, 2.1% 85.2%, 0.7% 76.1%, 2.0% 67.3%, 0.6% 58.4%, 2.2% 49.1%, 0.9% 40.3%, 2.1% 31.5%, 0.7% 22.6%, 1.9% 13.8%, 0.8% 6.2%)',
  // Variant 1 (Experiences)
  'polygon(2.0% 1.4%, 8.8% 2.5%, 16.1% 0.9%, 23.5% 2.1%, 31.4% 0.6%, 39.8% 2.3%, 47.2% 1.0%, 55.9% 2.4%, 63.7% 0.8%, 71.5% 2.0%, 79.8% 0.7%, 87.2% 2.2%, 94.5% 0.9%, 98.6% 2.5%, 99.3% 11.2%, 97.8% 20.1%, 99.2% 29.5%, 98.1% 38.4%, 99.4% 47.9%, 97.9% 56.8%, 99.3% 66.2%, 98.0% 75.4%, 99.2% 84.7%, 97.7% 93.1%, 98.4% 98.2%, 91.5% 99.3%, 83.2% 97.8%, 75.0% 99.1%, 66.8% 97.5%, 58.1% 99.2%, 49.4% 97.9%, 41.0% 99.3%, 32.6% 97.7%, 24.3% 99.0%, 16.2% 97.6%, 8.5% 99.2%, 1.9% 97.9%, 0.7% 90.6%, 2.2% 81.8%, 0.8% 72.5%, 2.0% 63.1%, 0.7% 53.9%, 2.1% 44.6%, 0.8% 35.2%, 2.2% 26.0%, 0.9% 16.9%, 2.0% 8.4%)',
  // Variant 2 (Interests)
  'polygon(1.6% 1.9%, 7.4% 0.7%, 14.8% 2.3%, 22.1% 0.8%, 29.7% 2.1%, 37.5% 0.9%, 45.3% 2.4%, 53.4% 0.7%, 61.8% 2.0%, 69.9% 0.8%, 77.6% 2.3%, 85.4% 0.6%, 92.8% 2.1%, 98.2% 1.2%, 99.1% 8.7%, 97.9% 17.4%, 99.4% 26.8%, 98.0% 36.1%, 99.2% 45.5%, 97.8% 54.9%, 99.3% 64.2%, 98.1% 73.6%, 99.4% 82.9%, 97.9% 91.8%, 98.7% 97.9%, 92.3% 98.9%, 84.1% 97.5%, 76.2% 99.3%, 67.9% 97.8%, 59.5% 99.1%, 51.2% 97.6%, 42.8% 99.2%, 34.4% 97.9%, 26.1% 99.3%, 17.8% 97.7%, 9.6% 99.1%, 2.2% 97.6%, 0.9% 91.2%, 2.1% 82.4%, 0.6% 73.1%, 1.9% 63.8%, 0.8% 54.5%, 2.2% 45.2%, 0.7% 35.8%, 2.0% 26.5%, 0.8% 17.2%, 2.1% 8.9%)',
];

const PENCIL_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23292725' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' fill='%23F5F0E8'/%3E%3Cpath d='m15 5 4 4'/%3E%3C/svg%3E") 2 22, crosshair`;

const TornSketchCard = ({
  id,
  src,
  alt,
  ariaLabel,
  variant = 0,
  tiltClass = '-rotate-1',
  objectPositionClass = 'object-center',
  onClick,
  compact = false,
}) => {
  const canvasRef = useRef(null);
  const lastPosRef = useRef(null);
  const isHoveringRef = useRef(false);
  const lastDrawTimeRef = useRef(0);
  const rafRef = useRef(null);

  const clipPath = TORN_CLIPS[variant % TORN_CLIPS.length];
  const underClipPath = TORN_CLIPS[(variant + 1) % TORN_CLIPS.length];

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.max(1, Math.round(rect.width * dpr));
    const targetH = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  // Softly fade old graphite strokes so sketches stay fresh across hovers
  const ensureFadeLoop = useCallback(() => {
    if (rafRef.current) return;

    const step = (now) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        rafRef.current = null;
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafRef.current = null;
        return;
      }

      const idleMs = now - lastDrawTimeRef.current;
      if (idleMs > 320) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = isHoveringRef.current
          ? 'rgba(0, 0, 0, 0.018)'
          : 'rgba(0, 0, 0, 0.045)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      if (!isHoveringRef.current && idleMs > 2600) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (compact) return undefined;
    syncCanvasSize();
    window.addEventListener('resize', syncCanvasSize);
    return () => {
      window.removeEventListener('resize', syncCanvasSize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [compact, syncCanvasSize]);

  const drawGraphiteSegment = useCallback((x0, y0, x1, y1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(dist / 2));

    // Slower strokes feel darker/heavier, brisk sweeps feel lighter/airy like real 2B graphite
    const speedFactor = Math.max(0.35, Math.min(1.0, 14 / (dist + 6)));
    const perpX = dist > 0.001 ? -dy / dist : 0;
    const perpY = dist > 0.001 ? dx / dist : 1;

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    // Subtle soft graphite core line with hand tremor
    ctx.beginPath();
    ctx.moveTo(x0 + (Math.random() - 0.5) * 0.8, y0 + (Math.random() - 0.5) * 0.8);
    ctx.lineTo(x1 + (Math.random() - 0.5) * 0.8, y1 + (Math.random() - 0.5) * 0.8);
    ctx.strokeStyle = `rgba(38, 36, 34, ${(0.22 * speedFactor).toFixed(3)})`;
    ctx.lineWidth = 1.4 + speedFactor * 1.1;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Granular graphite paper-tooth texture along the stroke
    for (let s = 0; s <= steps; s += 1) {
      const t = s / steps;
      const cx = x0 + dx * t;
      const cy = y0 + dy * t;
      const grainCount = 5 + Math.floor(speedFactor * 4);

      for (let g = 0; g < grainCount; g += 1) {
        const spread = (Math.random() - 0.5) * (3.2 + (1 - speedFactor) * 3.0);
        const along = (Math.random() - 0.5) * 2.0;
        const gx = cx + perpX * spread + along;
        const gy = cy + perpY * spread + along;
        const shade = 28 + Math.floor(Math.random() * 44);
        const alpha = (0.12 + Math.random() * 0.32) * speedFactor;
        const grainSize = 0.65 + Math.random() * 1.15;

        ctx.fillStyle = `rgba(${shade}, ${shade - 2}, ${shade - 4}, ${alpha.toFixed(3)})`;
        ctx.fillRect(gx, gy, grainSize, grainSize);
      }
    }

    ctx.restore();
  }, []);

  const handlePointerEnter = (e) => {
    if (compact) return;
    isHoveringRef.current = true;
    syncCanvasSize();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPosRef.current = { x, y };
    lastDrawTimeRef.current = performance.now();
    // Initial pencil touch-down mark
    drawGraphiteSegment(x - 1, y + 0.5, x + 1, y - 0.5);
    ensureFadeLoop();
  };

  const handlePointerMove = (e) => {
    if (compact) return;
    isHoveringRef.current = true;
    syncCanvasSize();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const prev = lastPosRef.current || { x, y };
    drawGraphiteSegment(prev.x, prev.y, x, y);
    lastPosRef.current = { x, y };
    lastDrawTimeRef.current = performance.now();
    ensureFadeLoop();
  };

  const handlePointerLeave = () => {
    isHoveringRef.current = false;
    lastPosRef.current = null;
  };

  if (compact) {
    return (
      <div
        className={`relative inline-block ${tiltClass}`}
        style={{
          filter:
            'drop-shadow(0 5px 10px rgba(26,23,20,0.14)) drop-shadow(0 1px 3px rgba(26,23,20,0.08))',
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#FAF6EE] translate-x-[2px] translate-y-[2px]"
          style={{ clipPath: underClipPath }}
        />
        <div
          className="relative w-[124px] sm:w-[140px] aspect-[10/9.5] overflow-hidden bg-[#F4EFE6]"
          style={{ clipPath }}
        >
          <img
            src={src}
            alt={alt}
            draggable="false"
            className={`w-full h-full object-cover ${objectPositionClass} block`}
          />
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="flex flex-col items-center justify-center scroll-mt-24">
      <motion.button
        type="button"
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        whileHover={{ scale: 1.04, y: -7, rotate: 0 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 340, damping: 22 }}
        aria-label={ariaLabel}
        className={`group relative block bg-transparent border-0 p-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F66BA]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-cream rounded-sm ${tiltClass}`}
        style={{
          cursor: PENCIL_CURSOR,
          filter:
            'drop-shadow(0 10px 20px rgba(26,23,20,0.14)) drop-shadow(0 2px 5px rgba(26,23,20,0.08))',
        }}
      >
        {/* Subtle torn-fiber paper edge peeking slightly behind */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#FAF6EE] translate-x-[2.5px] translate-y-[2.5px] transition-transform duration-300 group-hover:translate-x-[3.5px] group-hover:translate-y-[3.5px]"
          style={{ clipPath: underClipPath }}
        />

        {/* Torn sketchbook sheet with interactive graphite drawing canvas on top */}
        <div
          className="relative w-[245px] sm:w-[270px] lg:w-[285px] aspect-[10/9.5] overflow-hidden bg-[#F4EFE6]"
          style={{ clipPath }}
        >
          <img
            src={src}
            alt={alt}
            draggable="false"
            className={`w-full h-full object-cover ${objectPositionClass} block transition-transform duration-500 group-hover:scale-[1.03]`}
          />

          {/* Subtle paper grain vignette inside torn edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_18px_rgba(26,23,20,0.08)]"
          />

          {/* Real-time 2B graphite pencil mark canvas on cursor hover */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full z-10"
          />
        </div>
      </motion.button>
    </div>
  );
};

export default TornSketchCard;
