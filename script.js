// Corporate Resume Script
// - Theme toggle with persistence
// - Mobile menu toggle
// - Reveal on scroll
// - Active nav link highlighting
// - Smooth offset for anchor links

(function () {
  // Elements
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav a');
  const revealEls = document.querySelectorAll('.reveal');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const THEME_KEY = 'ops_theme_v1';

  // --- Theme toggle & persistence ---
  function applyTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('theme-dark');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      body.classList.remove('theme-dark');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  }

  (function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  })();

  themeToggle.addEventListener('click', () => {
    const isDark = body.classList.contains('theme-dark');
    applyTheme(isDark ? 'light' : 'dark');
    localStorage.setItem(THEME_KEY, body.classList.contains('theme-dark') ? 'dark' : 'light');
  });

  // --- Mobile menu toggle ---
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isShown = mobileNav.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', isShown ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', isShown ? 'false' : 'true');
      menuToggle.textContent = isShown ? '✕' : '☰';
    });

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.mobile-nav a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('show');
        mobileNav.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target) && mobileNav.classList.contains('show')) {
        mobileNav.classList.remove('show');
        mobileNav.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
    });
  }

  // --- Reveal on scroll ---
  function revealOnScroll() {
    const offset = window.innerHeight - 80;
    revealEls.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < offset) el.classList.add('visible');
    });
  }
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  window.addEventListener('resize', revealOnScroll);
  // initial call
  revealOnScroll();

  // --- Active nav highlighting ---
  function updateActiveNav() {
    const threshold = window.innerHeight / 3;
    let currentId = sections[0] ? sections[0].id : null;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom > threshold) {
        currentId = sec.id;
        break;
      }
    }
    navLinks.forEach(a => {
      if (a.getAttribute('href') === '#' + currentId) a.classList.add('active');
      else a.classList.remove('active');
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('load', updateActiveNav);

  // --- Smooth scroll offset for in-page links (account for fixed nav) ---
  navLinks.forEach(a => {
    a.addEventListener('click', function (e) {
      // allow normal behavior for external links
      const href = this.getAttribute('href') || '';
      if (!href.startsWith('#')) return;

      e.preventDefault();
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      const navHeight = Math.max(72, document.querySelector('.topbar').offsetHeight || 72);
      const targetY = target.getBoundingClientRect().top + window.scrollY - (navHeight + 12);
      window.scrollTo({ top: targetY, behavior: 'smooth' });

      // if mobile nav is open, close it
      if (mobileNav && mobileNav.classList.contains('show')) {
        mobileNav.classList.remove('show');
        mobileNav.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
    });
  });

  // make navigation keyboard friendly: Enter on focused link will click
  navLinks.forEach(a => {
    a.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') a.click();
    });
  });

})();
