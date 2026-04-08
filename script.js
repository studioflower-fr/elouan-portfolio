/* ============================================
   ELOUAN BEGUE — Portfolio Scripts
   ============================================ */

(function () {
  'use strict';

  // --- CUSTOM CURSOR ---
  const cursor = document.getElementById('cursor');
  const cursorDot = cursor ? cursor.querySelector('.cursor-dot') : null;
  const cursorCircle = cursor ? cursor.querySelector('.cursor-circle') : null;
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  // Only enable custom cursor on non-touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && cursor) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth cursor follow
    function animateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for project cards
    const hoverTargets = document.querySelectorAll('.card-hover');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Link hover — slightly enlarge circle
    const linkTargets = document.querySelectorAll('a, .menu-link, .footer-social-link');
    linkTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (cursorCircle) cursorCircle.style.transform = 'scale(1.3)';
        if (cursorDot) cursorDot.style.transform = 'scale(0.5)';
      });
      el.addEventListener('mouseleave', () => {
        if (cursorCircle) cursorCircle.style.transform = 'scale(1)';
        if (cursorDot) cursorDot.style.transform = 'scale(1)';
      });
    });
  }

  // --- HEADER HIDE ON SCROLL DOWN ---
  const header = document.getElementById('header');
  const hero = document.getElementById('hero');
  let lastScrollY = 0;

  function updateHeader() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down — hide header
      header.classList.add('hidden');
    } else {
      // Scrolling up — show header
      header.classList.remove('hidden');
    }
    lastScrollY = currentScrollY;
  }

  // --- PARALLAX ---
  const heroImage = document.querySelector('.hero-image');
  const parallaxImages = document.querySelectorAll('.parallax-img');

  function updateParallax() {
    const scrollY = window.scrollY;

    // Hero parallax — move image up as user scrolls down
    if (heroImage) {
      const speed = 0.2;
      heroImage.style.transform = `translate3d(0, -${scrollY * speed}px, 0)`;
    }

    // Project card image parallax
    parallaxImages.forEach((img) => {
      const card = img.closest('.project-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Only apply when card is in view
      if (rect.bottom > 0 && rect.top < windowH) {
        const progress = (rect.top + rect.height / 2) / windowH;
        const offset = (progress - 0.5) * 30; // subtle: max 15px shift
        img.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
  }

  // --- INTERSECTION OBSERVER (Reveal Animations) ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- ABOUT TEXT WORD ANIMATION ---
  const aboutText = document.querySelector('.about-text');
  if (aboutText) {
    const rawText = aboutText.textContent.trim();
    const words = rawText.split(/\s+/);
    // Clear existing content safely
    while (aboutText.firstChild) {
      aboutText.removeChild(aboutText.firstChild);
    }
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.transitionDelay = `${i * 0.03}s`;
      span.textContent = word;
      aboutText.appendChild(span);
      // Add space between words (text node)
      if (i < words.length - 1) {
        aboutText.appendChild(document.createTextNode(' '));
      }
    });
  }

  // --- ACTIVE MENU LINK TRACKING ---
  const sections = document.querySelectorAll('[id]');
  const menuLinks = document.querySelectorAll('.menu-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 200;

    let currentSection = '';
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentSection = section.getAttribute('id');
      }
    });

    menuLinks.forEach((link) => {
      link.classList.remove('active');
      const sectionAttr = link.getAttribute('data-section');
      if (sectionAttr === currentSection) {
        link.classList.add('active');
      }
    });
  }

  // --- PARIS TIME ---
  function updateParisTime() {
    const timeEl = document.getElementById('parisTime');
    if (!timeEl) return;
    const now = new Date();
    const parisTime = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
      hour12: false,
    }).format(now);
    timeEl.textContent = parisTime;
  }

  updateParisTime();
  setInterval(updateParisTime, 60000);

  // --- MENU LINKS: navigate to pages or smooth scroll for anchors ---
  menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Only smooth scroll for anchor links on same page
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        if (target) {
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
      // For .html links, let the browser navigate normally
    });
  });

  // --- PROJECT CARD CLICK NAVIGATION ---
  const projectMap = {
    norphe: 'work-norphe.html',
    allowa: 'work-allowa.html',
    fanzine: null,
    hausze: 'work-hausze.html',
    playground: 'playground.html',
    tetu: 'work-tetu.html',
    sandwich: 'work-monkey-vape.html',
    syno: 'work-syno.html',
    dinna: 'work-dina-summer.html',
  };

  document.querySelectorAll('.card-hover[data-project]').forEach((card) => {
    const project = card.getAttribute('data-project');
    const url = projectMap[project];
    if (url) {
      card.style.cursor = 'pointer';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', () => {
        window.location.href = url;
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = url;
        }
      });
    }
  });

  // --- SCROLL HANDLER (throttled via rAF) ---
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeader();

        updateParallax();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial calls
  updateHeader();
  updateParallax();
  updateActiveLink();

  // --- PAGE TRANSITION: FADE IN ---
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // --- PAGE TRANSITION: FADE OUT BEFORE NAVIGATING ---
  document.querySelectorAll('a[href]').forEach(link => {
    // Only internal page links — skip anchors, external links, mailto, and target="_blank"
    if (
      link.hostname === window.location.hostname &&
      !link.href.startsWith('mailto:') &&
      !link.target &&
      !link.getAttribute('href').startsWith('#')
    ) {
      link.addEventListener('click', function (e) {
        const href = this.href;
        e.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => {
          window.location.href = href;
        }, 350);
      });
    }
  });
})();
