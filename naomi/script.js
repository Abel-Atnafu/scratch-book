document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════════
     1. CUSTOM CURSOR
  ═══════════════════════════════════════════════════════ */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  if (cursor && cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = -100, my = -100;   // cursor circle (lagged)
    let dx = -100, dy = -100;   // dot (instant)
    let rafId;

    document.addEventListener('mousemove', e => {
      dx = e.clientX;
      dy = e.clientY;
    });

    function animateCursor() {
      mx += (dx - mx) * 0.14;
      my += (dy - my) * 0.14;
      cursor.style.left    = mx + 'px';
      cursor.style.top     = my + 'px';
      cursorDot.style.left = dx + 'px';
      cursorDot.style.top  = dy + 'px';
      rafId = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else animateCursor();
    });
  }


  /* ═══════════════════════════════════════════════════════
     2. CHAPTER NAV — highlight dot based on active section
  ═══════════════════════════════════════════════════════ */
  const nav     = document.getElementById('chapterNav');
  const dots    = document.querySelectorAll('.chapter-nav__dot');
  const chapters = document.querySelectorAll('.chapter[data-chapter]');

  const chapObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = parseInt(entry.target.dataset.chapter, 10);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    });
  }, { threshold: 0.4 });

  chapters.forEach(ch => chapObserver.observe(ch));

  /* Show nav after hero passes */
  const heroObserver = new IntersectionObserver(entries => {
    nav.classList.toggle('visible', !entries[0].isIntersecting);
  }, { threshold: 0.3 });

  const hero = document.getElementById('ch1');
  if (hero) heroObserver.observe(hero);

  /* Dot click → smooth scroll */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      chapters[i]?.scrollIntoView({ behavior: 'smooth' });
    });
  });


  /* ═══════════════════════════════════════════════════════
     3. SCROLL REVEAL — generic [data-reveal] elements
  ═══════════════════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


  /* ═══════════════════════════════════════════════════════
     4. LETTER LINE REVEAL — staggered per-line animation
  ═══════════════════════════════════════════════════════ */
  const letterSection = document.getElementById('ch6');
  const letterLines   = document.querySelectorAll('.letter__line');
  let letterTriggered = false;

  if (letterSection && letterLines.length) {
    const letterObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || letterTriggered) return;
      letterTriggered = true;
      letterLines.forEach((line, i) => {
        setTimeout(() => line.classList.add('revealed'), 200 + i * 160);
      });
      letterObserver.unobserve(letterSection);
    }, { threshold: 0.2 });

    letterObserver.observe(letterSection);
  }


  /* ═══════════════════════════════════════════════════════
     5. HORIZONTAL SCROLL — throwback strip
        mouse wheel on the section → scroll track horizontally
        also drag / touch
  ═══════════════════════════════════════════════════════ */
  const throwbackSection = document.getElementById('ch3');
  const trackWrap = document.getElementById('throwbackTrack')?.parentElement;

  if (trackWrap) {
    /* Wheel → horizontal */
    trackWrap.addEventListener('wheel', e => {
      e.preventDefault();
      trackWrap.scrollLeft += e.deltaY * 1.4;
    }, { passive: false });

    /* Drag */
    let dragging = false, startX = 0, scrollStart = 0;

    trackWrap.addEventListener('mousedown', e => {
      dragging    = true;
      startX      = e.pageX;
      scrollStart = trackWrap.scrollLeft;
      trackWrap.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      trackWrap.scrollLeft = scrollStart - (e.pageX - startX);
    });

    window.addEventListener('mouseup', () => {
      dragging = false;
      trackWrap.style.userSelect = '';
    });

    /* Touch swipe */
    let touchStartX = 0, touchScrollStart = 0;
    trackWrap.addEventListener('touchstart', e => {
      touchStartX      = e.touches[0].pageX;
      touchScrollStart = trackWrap.scrollLeft;
    }, { passive: true });

    trackWrap.addEventListener('touchmove', e => {
      trackWrap.scrollLeft = touchScrollStart - (e.touches[0].pageX - touchStartX);
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════════
     6. MAGNETIC HOVER — subtle tilt + translate on .magnetic
  ═══════════════════════════════════════════════════════ */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect   = el.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);  // -1 to 1
        const dy     = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
        const rotX   = dy * -5;   // tilt up/down
        const rotY   = dx *  5;   // tilt left/right
        const tx     = dx *  5;   // slight translate
        const ty     = dy *  5;
        el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${tx}px, ${ty}px)`;
        el.style.transition = 'transform 0.1s ease';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translate(0px, 0px)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }


  /* ═══════════════════════════════════════════════════════
     7. HERO — slow pan on hero photo when in view
  ═══════════════════════════════════════════════════════ */
  const heroSection = document.getElementById('ch1');
  if (heroSection) {
    const heroPanObserver = new IntersectionObserver(entries => {
      heroSection.classList.toggle('in-view', entries[0].isIntersecting);
    }, { threshold: 0.1 });
    heroPanObserver.observe(heroSection);
  }


  /* ═══════════════════════════════════════════════════════
     8. GOLD PARTICLES in hero
  ═══════════════════════════════════════════════════════ */
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    const symbols = ['✦', '·', '✧', '˚', '✦', '·'];
    const count   = 15;

    for (let i = 0; i < count; i++) {
      const p   = document.createElement('span');
      p.classList.add('particle');
      p.textContent = symbols[i % symbols.length];

      const x     = Math.random() * 100;
      const dur   = 11 + Math.random() * 14;
      const delay = Math.random() * 14;
      const drift = (Math.random() - 0.5) * 60;
      const size  = 0.5 + Math.random() * 0.7;

      p.style.cssText = `
        left: ${x}%;
        font-size: ${size}rem;
        animation-name: particleFloat;
        animation-duration: ${dur}s;
        animation-delay: -${delay}s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        --drift: ${drift}px;
      `;
      particleContainer.appendChild(p);
    }
  }


  /* ═══════════════════════════════════════════════════════
     9. CLOSING — trigger sub-animations when in view
  ═══════════════════════════════════════════════════════ */
  const closeContent = document.querySelector('.close__content');
  if (closeContent) {
    const closeObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        closeContent.classList.add('revealed');
        closeObserver.unobserve(closeContent);
      }
    }, { threshold: 0.3 });
    closeObserver.observe(closeContent);
  }

});
