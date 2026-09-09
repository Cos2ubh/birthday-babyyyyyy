(function () {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, stars = [], t = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    makeStars();
  }

  function makeStars() {
    const density = Math.floor((W * H) / 4800);
    stars = Array.from({ length: density }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.012 + 0.004,
      isCross: Math.random() < 0.12
    }));
  }

  function draw(now) {
    t = now * 0.001;
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      const alpha = 0.15 + 0.85 * ((Math.sin(s.phase + t * s.speed) + 1) / 2);
      if (s.isCross) {
        ctx.font = `${s.r * 9}px serif`;
        ctx.fillStyle = `rgba(255,215,0,${alpha * 0.65})`;
        ctx.shadowColor = `rgba(255,215,0,${alpha * 0.5})`;
        ctx.shadowBlur  = 5;
        ctx.fillText('✦', s.x - 5, s.y + 5);
        ctx.shadowBlur = 0;
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,249,200,${alpha})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
})();
