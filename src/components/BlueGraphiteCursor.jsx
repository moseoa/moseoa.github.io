import React, { useEffect, useRef } from 'react';

/**
 * Full-viewport transparent pastel light-blue graphite pencil trail
 * that gently sketches behind the cursor on both laptop (mouse/trackpad)
 * and mobile (touch), without wiping strokes during mobile URL bar shifts.
 */
const BlueGraphiteCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let canvasW = 0;
    let canvasH = 0;

    const syncSize = (force = false) => {
      const nextW = window.innerWidth;
      // Add extra vertical headroom so iOS Safari toolbar collapse/expand never forces a resize/clear
      const minH = (window.visualViewport?.height || window.innerHeight) + 160;
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);

      if (
        !force &&
        nextW === canvasW &&
        minH <= canvasH &&
        nextDpr === dpr
      ) {
        return;
      }

      dpr = nextDpr;
      canvasW = nextW;
      canvasH = Math.max(minH, window.innerHeight + 160);
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      canvas.width = Math.round(canvasW * dpr);
      canvas.height = Math.round(canvasH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    syncSize(true);

    let lastMousePos = null;
    let lastTouchPos = null;
    let activeTouchId = null;
    let lastDrawTime = 0;
    let rafId = null;
    let pendingTouchPoints = [];

    const drawBlueGraphite = (x0, y0, x1, y1, maxJump = 220) => {
      const dx = x1 - x0;
      const dy = y1 - y0;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.5 || dist > maxJump) return;

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

    const fadeLoop = (now) => {
      // Flush queued touch points cleanly inside rAF so high-refresh screens stay silk-smooth
      if (pendingTouchPoints.length > 0) {
        const batch = pendingTouchPoints;
        pendingTouchPoints = [];
        for (let i = 0; i < batch.length; i += 1) {
          const pt = batch[i];
          if (lastTouchPos) {
            drawBlueGraphite(lastTouchPos.x, lastTouchPos.y, pt.x, pt.y, 95);
          }
          lastTouchPos = pt;
        }
        lastDrawTime = now;
      }

      const idleMs = now - lastDrawTime;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = idleMs > 120 ? 'rgba(0, 0, 0, 0.032)' : 'rgba(0, 0, 0, 0.016)';
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.restore();

      if (idleMs > 1800 && pendingTouchPoints.length === 0) {
        ctx.clearRect(0, 0, canvasW, canvasH);
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

    const isPausedSurface = (target) =>
      Boolean(
        target &&
          typeof target.closest === 'function' &&
          target.closest('[data-graphite-card="true"], [data-sticker-stage="true"]')
      );

    // Desktop / laptop mouse & pen cursor trail (unchanged experience)
    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return;

      if (isPausedSurface(e.target)) {
        lastMousePos = null;
        return;
      }

      const x = e.clientX;
      const y = e.clientY;
      if (lastMousePos) {
        drawBlueGraphite(lastMousePos.x, lastMousePos.y, x, y, 220);
        lastDrawTime = performance.now();
        ensureFadeLoop();
      }
      lastMousePos = { x, y };
    };

    const onPointerLeave = () => {
      lastMousePos = null;
    };

    // Mobile / iPhone single-finger touch trail (passive so scrolling is never blocked)
    const findActiveTouch = (touches) => {
      if (!touches || touches.length === 0) return null;
      if (activeTouchId === null) return touches[0];
      for (let i = 0; i < touches.length; i += 1) {
        if (touches[i].identifier === activeTouchId) return touches[i];
      }
      return null;
    };

    const onTouchStart = (e) => {
      if (!e.touches || e.touches.length !== 1) {
        activeTouchId = null;
        lastTouchPos = null;
        pendingTouchPoints = [];
        return;
      }

      const touch = e.touches[0];
      activeTouchId = touch.identifier;
      pendingTouchPoints = [];

      if (isPausedSurface(e.target)) {
        lastTouchPos = null;
        return;
      }

      lastTouchPos = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (e) => {
      if (!e.touches || e.touches.length !== 1) {
        lastTouchPos = null;
        pendingTouchPoints = [];
        return;
      }

      const touch = findActiveTouch(e.touches);
      if (!touch) return;

      if (isPausedSurface(e.target)) {
        lastTouchPos = null;
        pendingTouchPoints = [];
        return;
      }

      pendingTouchPoints.push({ x: touch.clientX, y: touch.clientY });
      lastDrawTime = performance.now();
      ensureFadeLoop();
    };

    const onTouchEnd = () => {
      activeTouchId = null;
      lastTouchPos = null;
      pendingTouchPoints = [];
    };

    const onResize = () => syncSize(false);
    const onOrientationChange = () => syncSize(true);

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onOrientationChange);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientationChange);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[110]"
    />
  );
};

export default BlueGraphiteCursor;
