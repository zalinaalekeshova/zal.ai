/* ─────────────────────────────────────────
   ZAL.AI — main.js
   ───────────────────────────────────────── */

'use strict';

/* ── 1. Hero background crossfade ───────── */
(function initHeroBg() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;

  const SLIDE_COUNT = 3;
  const INTERVAL_MS = 4200;

  // Build slide elements
  const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => {
    const div = document.createElement('div');
    div.className = 'hero-bg__slide';
    bg.appendChild(div);
    return div;
  });

  let current = 0;
  slides[current].classList.add('is-active');

  setInterval(() => {
    slides[current].classList.remove('is-active');
    current = (current + 1) % SLIDE_COUNT;
    slides[current].classList.add('is-active');
  }, INTERVAL_MS);
})();


/* ── 2. Text scramble animation ─────────── */
(function initScramble() {
  const el = document.getElementById('tagline');
  if (!el) return;

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';
  const ORIGINAL = el.textContent.trim();
  const REVEAL_DELAY_PER_CHAR = 38; // ms between each char resolving
  const SCRAMBLE_CYCLES = 6;        // how many random frames before resolving
  const LOOP_PAUSE = 5000;          // pause between full loops
  const FRAME_MS = 42;              // ~24 fps scramble tick

  let running = false;
  let timeout = null;

  function rand(str) {
    return str
      .split('')
      .map(ch => ch === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)])
      .join('');
  }

  function scramble() {
    if (running) return;
    running = true;

    const chars = ORIGINAL.split('');
    const resolved = Array(chars.length).fill(false);
    let step = 0;
    const totalSteps = chars.length * SCRAMBLE_CYCLES;
    let frame = null;

    function tick() {
      step++;

      // Decide which characters to resolve this tick
      const resolveIndex = Math.floor(step / SCRAMBLE_CYCLES);
      for (let i = 0; i < resolveIndex; i++) {
        resolved[i] = true;
      }

      const display = chars.map((ch, i) => {
        if (resolved[i]) return ch;
        if (ch === ' ') return ' ';
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      el.textContent = display;

      if (step < totalSteps) {
        frame = setTimeout(tick, FRAME_MS);
      } else {
        el.textContent = ORIGINAL;
        running = false;
        timeout = setTimeout(scramble, LOOP_PAUSE);
      }
    }

    tick();
  }

  // Kick off after a short entrance delay
  timeout = setTimeout(scramble, 900);

  // Pause on reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearTimeout(timeout);
    el.textContent = ORIGINAL;
  }
})();


/* ── 3. Scroll-reveal via IntersectionObserver ── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.grid-item, .grid-row');
  if (!targets.length) return;

  // Skip animation for reduced-motion users — mark all visible immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger siblings within the same parent
          const siblings = Array.from(entry.target.parentNode.children);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ── 4. Cursor glow (desktop only) ─────── */
(function initCursorGlow() {
  // Skip on touch devices and reduced-motion
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);

  let mouseX = -500;
  let mouseY = -500;
  let glowX = -500;
  let glowY = -500;
  let rafId = null;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function loop() {
    glowX = lerp(glowX, mouseX, 0.1);
    glowY = lerp(glowY, mouseY, 0.1);
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    rafId = requestAnimationFrame(loop);
  }

  loop();
})();


/* ── 5. Grid item hover — colour accent on placeholder ── */
(function initItemHover() {
  const items = document.querySelectorAll('.grid-item');

  items.forEach(item => {
    const placeholder = item.querySelector('.placeholder');
    if (!placeholder) return;

    const type = item.dataset.type;
    const accentColor = type === 'video'
      ? 'hsl(220 100% 58% / 0.07)'
      : 'hsl(270 60% 55% / 0.06)';

    item.addEventListener('mouseenter', () => {
      placeholder.style.backgroundColor = accentColor;
    });
    item.addEventListener('mouseleave', () => {
      placeholder.style.backgroundColor = '';
    });

    // Keyboard support
    item.addEventListener('focus', () => {
      placeholder.style.backgroundColor = accentColor;
    });
    item.addEventListener('blur', () => {
      placeholder.style.backgroundColor = '';
    });
  });
})();


/* ── 6. Smooth-scroll nav links ─────────── */
(function initNavScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
