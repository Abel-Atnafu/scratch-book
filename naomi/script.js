document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════
     1. SCROLL REVEAL — [data-reveal] elements
  ═══════════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el    = e.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));


  /* ═══════════════════════════════════════════════════
     2. LETTER LINE REVEAL — staggered per line
  ═══════════════════════════════════════════════════ */
  const letterSection = document.getElementById('s7');
  const letterLines   = document.querySelectorAll('.l-line');
  let letterDone = false;

  if (letterSection && letterLines.length) {
    const letterObs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || letterDone) return;
      letterDone = true;
      letterLines.forEach((line, i) => {
        setTimeout(() => line.classList.add('revealed'), 150 + i * 130);
      });
      letterObs.unobserve(letterSection);
    }, { threshold: 0.15 });
    letterObs.observe(letterSection);
  }


  /* ═══════════════════════════════════════════════════
     3. STRIP — mouse-wheel horizontal scroll
  ═══════════════════════════════════════════════════ */
  const strip = document.querySelector('.s-strip');
  if (strip) {
    strip.addEventListener('wheel', e => {
      e.preventDefault();
      strip.scrollLeft += e.deltaY * 1.5;
    }, { passive: false });

    /* Drag */
    let drag = false, sx = 0, sl = 0;
    strip.addEventListener('mousedown', e => { drag = true; sx = e.pageX; sl = strip.scrollLeft; strip.style.cursor = 'grabbing'; });
    window.addEventListener('mousemove', e => { if (drag) strip.scrollLeft = sl - (e.pageX - sx); });
    window.addEventListener('mouseup',   () => { drag = false; strip.style.cursor = ''; });
  }


  /* ═══════════════════════════════════════════════════
     4. HERO — subtle parallax on scroll
  ═══════════════════════════════════════════════════ */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy < window.innerHeight) {
        heroImg.style.transform = `scale(1) translateY(${sy * 0.3}px)`;
      }
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════
     5. THROWBACK GRID — hover tilt (desktop)
  ═══════════════════════════════════════════════════ */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.tb-item').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
        card.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) scale(1.02)`;
        card.style.transition = 'transform 0.08s ease';
        card.style.zIndex = '5';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.zIndex = '';
      });
    });
  }


  /* ═══════════════════════════════════════════════════
     6. CLOSING PHOTOS — appear with staggered pop-in
  ═══════════════════════════════════════════════════ */
  const closeSection = document.getElementById('s8');
  const closePhotos  = document.querySelectorAll('.close-photo');
  let closeDone = false;

  if (closeSection && closePhotos.length) {
    const closeObs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || closeDone) return;
      closeDone = true;
      closeObs.unobserve(closeSection);
    }, { threshold: 0.2 });
    closeObs.observe(closeSection);
  }


  /* ═══════════════════════════════════════════════════
     7. PEOPLE ITEMS — amber glow on hover (desktop)
  ═══════════════════════════════════════════════════ */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.people-item').forEach(item => {
      item.addEventListener('mousemove', e => {
        const r  = item.getBoundingClientRect();
        const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
        item.style.transform = `perspective(900px) rotateY(${dx * 3}deg) rotateX(${-dy * 3}deg)`;
        item.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform  = '';
        item.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

});
