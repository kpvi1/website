// shootingstars.js - efekt spadających gwiazd
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'shooting-stars-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2';
  document.body.appendChild(canvas);

  let width = window.innerWidth;
  let height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  function randomStar() {
    // start from random x at top, random length, random speed
    const x = Math.random() * width * 0.8 + width * 0.1;
    const y = Math.random() * height * 0.2;
    const len = Math.random() * 80 + 80;
    const speed = Math.random() * 6 + 6;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // ~45deg
    return { x, y, len, speed, angle, alpha: 1 };
  }

  let stars = [];

  function spawnStar() {
    if (stars.length < 3 && Math.random() < 0.04) {
      stars.push(randomStar());
    }
  }

  function drawStar(star) {
    ctx.save();
    ctx.globalAlpha = star.alpha;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(
      star.x + Math.cos(star.angle) * star.len,
      star.y + Math.sin(star.angle) * star.len
    );
    ctx.stroke();
    ctx.restore();
  }

  let lastFrame = 0;
  function animate(ts) {
    if (!lastFrame || ts - lastFrame >= 1000/120) {
        ctx.clearRect(0, 0, width, height);
        spawnStar();
        for (let i = stars.length - 1; i >= 0; i--) {
          const star = stars[i];
          star.x += Math.cos(star.angle) * star.speed;
          star.y += Math.sin(star.angle) * star.speed;
          star.alpha -= 0.012;
          drawStar(star);
          if (star.alpha <= 0) stars.splice(i, 1);
        }
        lastFrame = ts;
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
