document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════════
     1. POLAROID TILT — read data-tilt → set CSS custom prop
  ═══════════════════════════════════════════════════════ */
  document.querySelectorAll('.polaroid').forEach(card => {
    const tilt = parseFloat(card.dataset.tilt) || 0;
    card.style.setProperty('--card-tilt', `${tilt}deg`);
    card.style.transform = `rotate(${tilt}deg)`;
  });


  /* ═══════════════════════════════════════════════════════
     2. SCROLL REVEAL — Intersection Observer
  ═══════════════════════════════════════════════════════ */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('revealed'), delay);
      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  /* Observe section headers and timeline entries */
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  /* Observe polaroids with a staggered delay */
  document.querySelectorAll('.polaroid').forEach((card, i) => {
    card.dataset.delay = i * 90;
    observer.observe(card);
  });


  /* ═══════════════════════════════════════════════════════
     3. FLOATING PARTICLES in hero
  ═══════════════════════════════════════════════════════ */
  function spawnParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const symbols = ['♡', '✦', '✿', '·', '❀', '˚', '✧'];
    const count = 22;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.classList.add('particle');
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      const x     = Math.random() * 100;
      const size  = 0.65 + Math.random() * 1.5;
      const dur   = 9 + Math.random() * 13;
      const delay = Math.random() * 12;
      const drift = (Math.random() - 0.5) * 70;
      const hue   = 280 + Math.random() * 60;   /* purple-pink range */
      const light = 65 + Math.random() * 20;

      p.style.cssText = `
        left: ${x}%;
        font-size: ${size}rem;
        animation-duration: ${dur}s;
        animation-delay: -${delay}s;
        --drift: ${drift}px;
        color: hsl(${hue}, 55%, ${light}%);
      `;
      container.appendChild(p);
    }
  }

  spawnParticles();


  /* ═══════════════════════════════════════════════════════
     4. POLAROID LIGHTBOX — click to focus / zoom
  ═══════════════════════════════════════════════════════ */
  const overlay = document.getElementById('lightboxOverlay');
  let focused = null;

  function openCard(card) {
    if (focused) closeCard();
    focused = card;
    card.classList.add('polaroid--focused');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeCard() {
    if (!focused) return;
    focused.classList.remove('polaroid--focused');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    focused = null;
  }

  document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      if (card.classList.contains('polaroid--focused')) {
        closeCard();
      } else {
        openCard(card);
      }
    });
  });

  overlay.addEventListener('click', closeCard);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCard();
  });


  /* ═══════════════════════════════════════════════════════
     5. HEART TRAIL on cursor (subtle, only on desktop)
  ═══════════════════════════════════════════════════════ */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let lastTrail = 0;

    document.addEventListener('mousemove', e => {
      const now = Date.now();
      if (now - lastTrail < 120) return;
      lastTrail = now;

      const heart = document.createElement('span');
      heart.textContent = '♡';
      heart.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        pointer-events: none;
        font-size: ${0.55 + Math.random() * 0.55}rem;
        color: hsl(${310 + Math.random() * 40}, 60%, 72%);
        z-index: 9999;
        user-select: none;
        transform: translate(-50%, -50%);
        animation: trailFade 0.9s ease forwards;
      `;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 900);
    });

    /* Inject trail animation if not already in styles */
    if (!document.getElementById('trailStyle')) {
      const s = document.createElement('style');
      s.id = 'trailStyle';
      s.textContent = `
        @keyframes trailFade {
          0%   { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0;   transform: translate(-50%, -120%) scale(0.4); }
        }
      `;
      document.head.appendChild(s);
    }
  }

});
