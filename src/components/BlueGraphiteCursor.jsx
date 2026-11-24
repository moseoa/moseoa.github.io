import React, { useEffect, useRef } from 'react';

/**
 * Full-viewport transparent pastel light-blue graphite pencil trail
 * that gently sketches behind the cursor on both laptop (mouse/trackpad)
 * and mobile (touch), plus a floating pencil nib indicator during touch.
 */
const BlueGraphiteCursor = () => {
  const canvasRef = useRef(null);
  const touchPencilRef = useRef(null);
  const touchPencilFillRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let viewW = window.innerWidth;
    let viewH = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewW = window.visualViewport?.width || window.innerWidth;
      viewH = window.visualViewport?.height || window.innerHeight;
      canvas.width = Math.round(viewW * dpr);
      canvas.height = Math.round(viewH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let lastMousePos = null;
    let lastTouchPos = null;
    let lastDrawTime = 0;
    let rafId = null;
    let hidePencilTimer = null;

    const fadeLoop = (now) => {
      const idleMs = now - lastDrawTime;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = idleMs > 120 ? 'rgba(0, 0, 0, 0.032)' : 'rgba(0, 0, 0, 0.016)';
      ctx.fillRect(0, 0, viewW, viewH);
      ctx.restore();

      if (idleMs > 1800) {
        ctx.clearRect(0, 0, viewW, viewH);
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

    const isInteractiveTarget = (target) =>
      Boolean(
        target &&
          typeof target.closest === 'function' &&
          target.closest('a, button, [role="button"], .cursor-pointer')
      );

    const showTouchPencil = (x, y, target) => {
      const nib = touchPencilRef.current;
      if (!nib) return;
      if (hidePencilTimer) {
        window.clearTimeout(hidePencilTimer);
        hidePencilTimer = null;
      }
      if (
        target &&
        typeof target.closest === 'function' &&
        target.closest('[data-sticker-stage="true"]')
      ) {
        nib.style.opacity = '0';
        return;
      }
      if (touchPencilFillRef.current) {
        touchPencilFillRef.current.setAttribute(
          'fill',
          isInteractiveTarget(target) ? '#4F66BA' : '#9ED4F7'
        );
      }
      // Offset so the pencil lead tip (4, 24) rests cleanly right above/under the finger
      nib.style.transform = `translate3d(${Math.round(x - 4)}px, ${Math.round(y - 24)}px, 0)`;
      nib.style.opacity = '0.92';
    };

    const hideTouchPencil = (delayMs = 340) => {
      const nib = touchPencilRef.current;
      if (!nib) return;
      if (hidePencilTimer) window.clearTimeout(hidePencilTimer);
      if (delayMs <= 0) {
        nib.style.opacity = '0';
        return;
      }
      hidePencilTimer = window.setTimeout(() => {
        if (touchPencilRef.current) {
          touchPencilRef.current.style.opacity = '0';
        }
      }, delayMs);
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
      // Touch input is handled continuously via passive touch listeners so iOS Safari scroll never cancels it
      if (e.pointerType === 'touch') return;

      hideTouchPencil(0);

      if (isPausedSurface(e.target)) {
        lastMousePos = null;
        return;
      }

      const x = e.clientX;
      const y = e.clientY;
      if (lastMousePos) {
        drawBlueGraphite(lastMousePos.x, lastMousePos.y, x, y);
        lastDrawTime = performance.now();
        ensureFadeLoop();
      }
      lastMousePos = { x, y };
    };

    const onPointerLeave = () => {
      lastMousePos = null;
    };

    const onTouchStart = (e) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      const x = touch.clientX;
      const y = touch.clientY;
      showTouchPencil(x, y, e.target);

      if (isPausedSurface(e.target)) {
        lastTouchPos = null;
        return;
      }

      lastTouchPos = { x, y };
      drawBlueGraphite(x - 1.5, y + 1, x + 1.5, y - 1);
      lastDrawTime = performance.now();
      ensureFadeLoop();
    };

    const onTouchMove = (e) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      const x = touch.clientX;
      const y = touch.clientY;
      showTouchPencil(x, y, e.target);

      if (isPausedSurface(e.target)) {
        lastTouchPos = null;
        return;
      }

      if (lastTouchPos) {
        drawBlueGraphite(lastTouchPos.x, lastTouchPos.y, x, y);
        lastDrawTime = performance.now();
        ensureFadeLoop();
      }
      lastTouchPos = { x, y };
    };

    const onTouchEnd = () => {
      lastTouchPos = null;
      hideTouchPencil(320);
    };

    window.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      if (hidePencilTimer) window.clearTimeout(hidePencilTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none z-[110]"
      />
      {/* Floating touch-device pencil nib (matches CSS desktop pencil cursor; stays hidden on mouse) */}
      <div
        ref={touchPencilRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[220] opacity-0 transition-opacity duration-200 will-change-transform"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="drop-shadow-[0_2px_4px_rgba(30,42,94,0.22)]"
        >
          <path
            ref={touchPencilFillRef}
            d="M21.2 3.2a2.4 2.4 0 0 1 3.4 3.4L10.3 20.9 4.5 23.5l2.6-5.8L21.2 3.2Z"
            fill="#9ED4F7"
            stroke="#1E2A5E"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M18.4 6l3.4 3.4" stroke="#1E2A5E" strokeWidth="1.6" />
          <path
            d="M21.2 3.2a2.4 2.4 0 0 1 3.4 3.4l-1.9 1.9-3.4-3.4 1.9-1.9Z"
            fill="#F7F3EA"
            stroke="#1E2A5E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M7.1 17.7l3.2 3.2-5.8 2.6 2.6-5.8Z"
            fill="#F5E6D3"
            stroke="#1E2A5E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M4.5 23.5l2.4-1.1-1.3-1.3-1.1 2.4Z" fill="#4F66BA" />
        </svg>
      </div>
    </>
  );
};

export default BlueGraphiteCursor;
