/* ═══════════════════════════════════════════════════════════════
   SAI KIREETI CHALAMALASETTY — Ultra-Premium Cinematic Portfolio
   script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Utility: clamp ── */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/* ══════════════════════════════════════
   1. CUSTOM ANIMATED CURSOR
══════════════════════════════════════ */
(function initCursor() {
  const outer = document.getElementById('cursorOuter');
  const inner = document.getElementById('cursorInner');
  if (!outer || !inner) return;

  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    outer.style.display = 'none';
    inner.style.display = 'none';
    return;
  }

  let mouseX = -100, mouseY = -100;
  let outerX = -100, outerY = -100;

  // Inner follows instantly
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.left = mouseX + 'px';
    inner.style.top  = mouseY + 'px';
  });

  // Outer follows with easing via rAF
  function animateOuter() {
    const dx = mouseX - outerX;
    const dy = mouseY - outerY;
    outerX += dx * 0.14;
    outerY += dy * 0.14;
    outer.style.left = outerX + 'px';
    outer.style.top  = outerY + 'px';
    requestAnimationFrame(animateOuter);
  }
  animateOuter();

  // Morph on hoverable elements
  const hoverEls = document.querySelectorAll(
    'a, button, .cursor-hover, input, textarea, [role="button"]'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      outer.classList.add('hovered');
      inner.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      outer.classList.remove('hovered');
      inner.classList.remove('hovered');
    });
  });

  // Hide on leave
  document.addEventListener('mouseleave', () => {
    outer.style.opacity = '0';
    inner.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    outer.style.opacity = '1';
    inner.style.opacity = '1';
  });
})();

/* ══════════════════════════════════════
   2. PARTICLE / CONSTELLATION SYSTEM
══════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };

  const CONFIG = {
    count:        window.innerWidth < 768 ? 40 : 80,
    maxDist:      140,
    speed:        0.35,
    radius:       1.8,
    color:        [99, 102, 241],
    mouseInfluence: 120,
  };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: Math.random() * CONFIG.radius + 0.5,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion (subtle)
      const dmx = p.x - mouse.x;
      const dmy = p.y - mouse.y;
      const dm = Math.sqrt(dmx * dmx + dmy * dmy);
      if (dm < CONFIG.mouseInfluence) {
        const force = (CONFIG.mouseInfluence - dm) / CONFIG.mouseInfluence * 0.02;
        p.vx += dmx / dm * force;
        p.vy += dmy / dm * force;
      }

      // Speed clamp
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > CONFIG.speed * 2) {
        p.vx = (p.vx / spd) * CONFIG.speed * 2;
        p.vy = (p.vy / spd) * CONFIG.speed * 2;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color[0]},${CONFIG.color[1]},${CONFIG.color[2]},0.55)`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDist) {
          const alpha = (1 - dist / CONFIG.maxDist) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${CONFIG.color[0]},${CONFIG.color[1]},${CONFIG.color[2]},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  // Track mouse relative to canvas
  const heroSection = canvas.closest('.hero-scene');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  init();
  draw();
})();

/* ══════════════════════════════════════
   3. TYPEWRITER EFFECT
══════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('typewriterEl');
  if (!el) return;

  const phrases = [
    'scalable web apps',
    'AI-powered tools',
    'generative AI pipelines',
    'production ML systems',
    'enterprise fintech platforms',
    'intelligent full-stack systems',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  let pauseTimer = null;

  const TYPING_SPEED  = 60;
  const DELETING_SPEED = 35;
  const PAUSE_AFTER   = 1800;
  const PAUSE_BEFORE  = 300;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      // Typing
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        pauseTimer = setTimeout(tick, PAUSE_AFTER);
        return;
      }
    } else {
      // Deleting
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pauseTimer = setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(tick, deleting ? DELETING_SPEED : TYPING_SPEED);
  }

  setTimeout(tick, 1000);
})();

/* ══════════════════════════════════════
   4. INTERSECTION OBSERVER — REVEAL
══════════════════════════════════════ */
(function initReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-fade, .reveal-slide, .reveal-up, .reveal-left, .reveal-right'
  );

  if (!revealEls.length) return;

  // Apply stagger delays
  revealEls.forEach(el => {
    const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
    if (delay) {
      el.style.transitionDelay = delay + 'ms';
    }
  });

  // Stagger grid children automatically
  document.querySelectorAll('.specialty-grid, .skills-canvas, .bento-grid, .hero-stats-cluster').forEach(grid => {
    const children = grid.querySelectorAll(':scope > *');
    children.forEach((child, i) => {
      if (!child.dataset.delay) {
        child.style.transitionDelay = (i * 80) + 'ms';
      }
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════
   5. NAVBAR: HIDE / SHOW + SCROLLED STATE
══════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking    = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const current = window.scrollY;

        // Scrolled styling
        if (current > 40) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }

        // Hide/show on direction
        if (current > lastScroll && current > 300) {
          nav.classList.add('hidden');
        } else {
          nav.classList.remove('hidden');
        }

        lastScroll = current <= 0 ? 0 : current;
        ticking = false;
      });
      ticking = true;
    }
  });

  // Active section highlight
  const sections = document.querySelectorAll('.scene[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => sectionObserver.observe(s));
})();

/* ══════════════════════════════════════
   6. SCROLL PROGRESS BAR
══════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? clamp((scrolled / total) * 100, 0, 100) : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════
   7. COUNT-UP ANIMATION
══════════════════════════════════════ */
(function initCountUp() {
  const countEls = document.querySelectorAll('.count-up');
  if (!countEls.length) return;

  const duration = 1600;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el) {
    const target  = parseInt(el.dataset.target, 10);
    const start   = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = clamp(elapsed / duration, 0, 1);
      const val = Math.round(easeOutCubic(progress) * target);
      el.textContent = val;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  countEls.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════
   8. SMOOTH SCROLL FOR NAV LINKS
══════════════════════════════════════ */
(function initSmoothScroll() {
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72',
    10
  );

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const hash = anchor.getAttribute('href');
      if (hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      const navLinks = document.getElementById('navLinks');
      const hamburger = document.getElementById('hamburger');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  });
})();

/* ══════════════════════════════════════
   9. MOBILE HAMBURGER MENU
══════════════════════════════════════ */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('navLinks');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
})();

/* ══════════════════════════════════════
   10. THEME TOGGLE (Dark / Light)
══════════════════════════════════════ */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;
  if (!btn || !icon) return;

  // Load saved theme
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  html.dataset.theme = saved;
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const current = html.dataset.theme;
    const next    = current === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
})();

/* ══════════════════════════════════════
   11. PARALLAX — Hero elements on scroll
══════════════════════════════════════ */
(function initParallax() {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const heroName = document.querySelector('.hero-name');
  const heroRight = document.querySelector('.hero-right');

  if (!orb1 && !orb2) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const limit   = window.innerHeight;
        if (scrollY > limit) { ticking = false; return; }
        const t = scrollY / limit;

        if (orb1) {
          orb1.style.transform = `translate(${t * -40}px, ${t * -60}px) scale(${1 + t * 0.1})`;
        }
        if (orb2) {
          orb2.style.transform = `translate(${t * 40}px, ${t * 40}px) scale(${1 - t * 0.05})`;
        }
        if (heroName) {
          heroName.style.transform = `translateY(${t * -30}px)`;
          heroName.style.opacity   = `${1 - t * 1.5}`;
        }
        if (heroRight) {
          heroRight.style.transform = `translateY(${t * -20}px)`;
          heroRight.style.opacity   = `${1 - t * 1.2}`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════
   12. CONTACT FORM
══════════════════════════════════════ */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('cfSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#cf-name')?.value.trim();
    const email   = form.querySelector('#cf-email')?.value.trim();
    const message = form.querySelector('#cf-message')?.value.trim();

    if (!name || !email || !message) {
      // Shake required empty inputs
      [['#cf-name', name], ['#cf-email', email], ['#cf-message', message]].forEach(([sel, val]) => {
        if (!val) {
          const el = form.querySelector(sel);
          el && shakeEl(el);
        }
      });
      return;
    }

    // Simulate send
    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1400);
  });

  function shakeEl(el) {
    el.style.animation = 'none';
    el.style.borderColor = 'rgba(239,68,68,0.7)';
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' },
    ], { duration: 380, easing: 'ease-in-out' }).onfinish = () => {
      el.style.borderColor = '';
    };
  }
})();

/* ══════════════════════════════════════
   13. FOOTER YEAR
══════════════════════════════════════ */
(function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ══════════════════════════════════════
   14. SKILL PANEL HOVER TILT (subtle 3D)
══════════════════════════════════════ */
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const panels = document.querySelectorAll('.skill-panel, .bcard, .scard, .hstat, .tl-card');

  panels.forEach(panel => {
    panel.addEventListener('mousemove', e => {
      const rect   = panel.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = clamp(dy * -4, -4, 4);
      const tiltY  = clamp(dx *  4, -4, 4);

      panel.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    panel.addEventListener('mouseleave', () => {
      panel.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════
   15. STAGGER ANIMATION DELAYS (grid children)
══════════════════════════════════════ */
(function initStaggerDelays() {
  const selectors = [
    { container: '.bento-grid',        children: '.bcard',          baseDelay: 0, step: 120 },
    { container: '.specialty-grid',    children: '.scard',          baseDelay: 0, step: 140 },
    { container: '.hero-stats-cluster', children: '.hstat',         baseDelay: 400, step: 120 },
    { container: '.ftags-orbit',       children: '.ftag',           baseDelay: 700, step: 80 },
    { container: '.cinematic-timeline', children: '.tl-entry',      baseDelay: 0, step: 100 },
    { container: '.edu-stage',          children: '.edu-card',      baseDelay: 0, step: 100 },
  ];

  selectors.forEach(({ container, children, baseDelay, step }) => {
    document.querySelectorAll(container).forEach(wrapper => {
      wrapper.querySelectorAll(children).forEach((child, i) => {
        if (!child.dataset.delay) {
          child.style.transitionDelay = (baseDelay + i * step) + 'ms';
        }
      });
    });
  });
})();

/* ══════════════════════════════════════
   16. TIMELINE LINE ANIMATION (draw on scroll)
══════════════════════════════════════ */
(function initTimelineDraw() {
  const spine = document.querySelector('.timeline-spine');
  if (!spine) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          spine.style.opacity    = '0.3';
          spine.style.transition = 'opacity 1s ease';
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(spine);
})();

/* ══════════════════════════════════════
   17. MAGNETIC BUTTON EFFECT (hero CTAs)
══════════════════════════════════════ */
(function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;

  const magnetEls = document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta');

  magnetEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.25;
      const dy     = (e.clientY - cy) * 0.25;
      el.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════
   18. SKILLS CANVAS: PANEL ENTRANCE STAGGER
══════════════════════════════════════ */
(function initSkillPanels() {
  const panels = document.querySelectorAll('.skill-panel');
  if (!panels.length) return;

  // Apply rotation subtleties
  const rotations = [
    '-1.5deg', '0.5deg', '1deg',
    '-0.5deg', '0.8deg', '-1deg',
    '1.2deg'
  ];

  panels.forEach((panel, i) => {
    const rot = rotations[i % rotations.length];
    // Store default rotation so hover can restore it
    panel.dataset.defaultRotate = rot;
    panel.style.setProperty('--panel-rotate', rot);
  });
})();

/* ══════════════════════════════════════
   19. SCROLL-LINKED GRADIENT MESH SHIFT
══════════════════════════════════════ */
(function initMeshScroll() {
  const mesh = document.querySelector('.mesh-gradient');
  if (!mesh) return;

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / window.innerHeight;
    const hue = 240 + pct * 30;
    mesh.style.filter = `hue-rotate(${hue - 240}deg)`;
  }, { passive: true });
})();

/* ══════════════════════════════════════
   20. BENTO CARD: GLOW FOLLOW MOUSE
══════════════════════════════════════ */
(function initCardGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.bcard');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--gx', x + '%');
      card.style.setProperty('--gy', y + '%');
    });
  });
})();

/* ══════════════════════════════════════
   21. INIT LOG
══════════════════════════════════════ */
(function logInit() {
  const styles = [
    'color: #6366f1',
    'font-size: 14px',
    'font-weight: bold',
  ].join(';');
  console.log('%c⬡ Sai Kireeti Chalamalasetty — Portfolio Loaded', styles);
  console.log('%csaikireetichalamalasetty@gmail.com | github.com/sai-kireeti', 'color: #8080a0; font-size: 11px');
})();
