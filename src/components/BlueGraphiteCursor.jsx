import React, { useEffect, useRef } from 'react';

/**
 * Full-viewport transparent pastel light-blue graphite pencil trail
 * that gently sketches behind the cursor as you navigate the sketchbook.
 */
const BlueGraphiteCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    // Skip on coarse touch-only devices
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let lastPos = null;
    let lastDrawTime = 0;
    let rafId = null;

    const fadeLoop = (now) => {
      const idleMs = now - lastDrawTime;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = idleMs > 120 ? 'rgba(0, 0, 0, 0.032)' : 'rgba(0, 0, 0, 0.016)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.restore();

      if (idleMs > 1800) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(fadeLoop);
    };

    const ensureFadeLoop = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(fadeLoop);
      }
    };

    const drawBlueGraphite = (x0, y0, x1, y1) => {
      const dx = x1 - x0;
      const dy = y1 - y0;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.5 || dist > 220) return;

      const steps = Math.max(1, Math.ceil(dist / 2.2));
      const speedFactor = Math.max(0.32, Math.min(1.0, 16 / (dist + 8)));
      const perpX = -dy / dist;
      const perpY = dx / dist;

      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      // Airy transparent light-blue graphite core stroke
      ctx.beginPath();
      ctx.moveTo(x0 + (Math.random() - 0.5) * 0.7, y0 + (Math.random() - 0.5) * 0.7);
      ctx.lineTo(x1 + (Math.random() - 0.5) * 0.7, y1 + (Math.random() - 0.5) * 0.7);
      ctx.strokeStyle = `rgba(116, 180, 236, ${(0.17 * speedFactor).toFixed(3)})`;
      ctx.lineWidth = 1.2 + speedFactor * 0.9;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Delicate granular light-blue colored-pencil tooth along the stroke
      for (let s = 0; s <= steps; s += 1) {
        const t = s / steps;
        const cx = x0 + dx * t;
        const cy = y0 + dy * t;
        const grains = 3 + Math.floor(speedFactor * 3);

        for (let g = 0; g < grains; g += 1) {
          const spread = (Math.random() - 0.5) * (3.6 + (1 - speedFactor) * 2.4);
          const along = (Math.random() - 0.5) * 1.8;
          const gx = cx + perpX * spread + along;
          const gy = cy + perpY * spread + along;
          const alpha = (0.09 + Math.random() * 0.22) * speedFactor;
          const size = 0.7 + Math.random() * 1.1;

          // Subtle variation between sky blue (#7FC4F4) and soft periwinkle (#689FE0)
          const r = 104 + Math.floor(Math.random() * 38);
          const gr = 172 + Math.floor(Math.random() * 34);
          const b = 232 + Math.floor(Math.random() * 20);
          ctx.fillStyle = `rgba(${r}, ${gr}, ${b}, ${alpha.toFixed(3)})`;
          ctx.fillRect(gx, gy, size, size);
        }
      }

      ctx.restore();
    };

    const onPointerMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;

      // Pause blue trail directly over dark-charcoal torn sketch cards or photo sticker canvas
      const target = e.target;
      if (
        target &&
        typeof target.closest === 'function' &&
        target.closest('[data-graphite-card="true"], [data-sticker-stage="true"]')
      ) {
        lastPos = null;
        return;
      }

      const x = e.clientX;
      const y = e.clientY;
      if (lastPos) {
        drawBlueGraphite(lastPos.x, lastPos.y, x, y);
        lastDrawTime = performance.now();
        ensureFadeLoop();
      }
      lastPos = { x, y };
    };

    const onPointerLeave = () => {
      lastPos = null;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-[110]"
    />
  );
};

export default BlueGraphiteCursor;
