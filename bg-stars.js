(function () {
  'use strict';

  // ── Star map image background ─────────────────────────────
  const bgImg = document.createElement('div');
  bgImg.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:0', 'pointer-events:none',
    'background:url(images/star-map.jpg) center/cover no-repeat',
    'background-attachment:scroll'
  ].join(';');
  document.body.prepend(bgImg);

  // Dark overlay — keeps text readable over the bright map
  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:1', 'pointer-events:none',
    'background:rgba(3,3,12,0.68)'
  ].join(';');
  document.body.prepend(overlay);

  // ── Animated sparkle canvas on top ────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:2;pointer-events:none;opacity:0.55;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    makeStars();
  }

  function makeStars() {
    const density = Math.floor((W * H) / 5500);
    stars = Array.from({ length: density }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.2 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.012 + 0.004,
      isCross: Math.random() < 0.1
    }));
  }

  function draw(now) {
    const t = now * 0.001;
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      const alpha = 0.12 + 0.88 * ((Math.sin(s.phase + t * s.speed) + 1) / 2);
      if (s.isCross) {
        ctx.font        = `${s.r * 9}px serif`;
        ctx.fillStyle   = `rgba(255,215,0,${alpha * 0.6})`;
        ctx.shadowColor = `rgba(255,215,0,${alpha * 0.45})`;
        ctx.shadowBlur  = 5;
        ctx.fillText('✦', s.x - 5, s.y + 5);
        ctx.shadowBlur  = 0;
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,249,200,${alpha})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }

  // Update .page z-index so it sits above all background layers
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.page').forEach(p => {
      p.style.position = 'relative';
      p.style.zIndex   = '3';
    });
  });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
})();
