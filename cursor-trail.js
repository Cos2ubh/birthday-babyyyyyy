(function () {
  'use strict';

  // Canvas-based cursor trail — GPU composited, zero layout thrashing
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:10000;pointer-events:none;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const TRAIL    = 9;          // number of star points
  const MAX_HIST = 80;         // position history depth
  const CHARS    = ['✦','✧','✦','✧','⋆','✦','✧','⋆','✦'];
  const history  = [];

  let mx = -300, my = -300;

  function push(x, y) {
    history.unshift({ x, y });
    if (history.length > MAX_HIST) history.pop();
  }

  document.addEventListener('mousemove', e => push(e.clientX, e.clientY), { passive: true });

  // Touch: trail on move, burst on tap
  document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    push(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    push(t.clientX, t.clientY);
    burstAt(t.clientX, t.clientY);
  }, { passive: true });

  const bursts = [];
  function burstAt(x, y) {
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 1.5 + Math.random() * 1.5;
      bursts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        char: CHARS[i % CHARS.length],
        size: 10 + Math.random() * 6
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw trail
    if (history.length > 0) {
      for (let i = 0; i < TRAIL; i++) {
        const histIdx = Math.min(
          Math.floor((i / TRAIL) * history.length * 0.55),
          history.length - 1
        );
        const p       = history[histIdx];
        const frac    = i / TRAIL;
        const size    = 13.5 - frac * 8;
        const alpha   = (1 - frac) * 0.95;
        const glow    = Math.round((1 - frac) * 10);

        ctx.font         = `${size}px serif`;
        ctx.fillStyle    = `rgba(255,215,0,${alpha})`;
        ctx.shadowColor  = `rgba(255,215,0,${alpha * 0.85})`;
        ctx.shadowBlur   = glow;
        ctx.fillText(CHARS[i], p.x, p.y);
      }
    }

    // Draw touch bursts
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      ctx.font        = `${b.size}px serif`;
      ctx.fillStyle   = `rgba(255,215,0,${b.life})`;
      ctx.shadowColor = `rgba(255,215,0,${b.life * 0.7})`;
      ctx.shadowBlur  = 8;
      ctx.fillText(b.char, b.x, b.y);

      b.x    += b.vx;
      b.y    += b.vy;
      b.vy   += 0.07; // slight gravity
      b.life -= 0.045;
      if (b.life <= 0) bursts.splice(i, 1);
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
