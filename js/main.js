/**
 * main.js — Salsabeel Zahra Portfolio
 * Fixed & Optimized for GitHub Pages
 *
 * Fixes applied:
 * 1. Gallery filter now uses data attributes (not inline onclick) — works reliably after deployment
 * 2. Lightbox attached via event delegation — no inline onclick needed in HTML
 * 3. Hamburger aria-expanded toggled for accessibility
 * 4. Separate filter logic for textile gallery vs graphic design gallery
 * 5. Defensive null checks before accessing DOM elements
 * 6. closeLB / closeMenu can be safely called multiple times
 */

'use strict';

/* ----------------------------------------------------------
   NAV — scroll shadow
   ---------------------------------------------------------- */
const nav = document.getElementById('nav');

if (nav) {
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load in case page is already scrolled
  onScroll();
}

/* ----------------------------------------------------------
   HAMBURGER MENU
   ---------------------------------------------------------- */
const hamburger   = document.getElementById('hamburgerBtn');
const mobileMenu  = document.getElementById('mobileMenu');
const overlayBlur = document.getElementById('overlayBlur');

function closeMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('active');
  mobileMenu.setAttribute('aria-hidden', 'true');
  overlayBlur && overlayBlur.classList.remove('active');
  hamburger && hamburger.classList.remove('active');
  hamburger && hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function openMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('active');
  mobileMenu.setAttribute('aria-hidden', 'false');
  overlayBlur && overlayBlur.classList.add('active');
  hamburger && hamburger.classList.add('active');
  hamburger && hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function toggleMenu() {
  if (mobileMenu && mobileMenu.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (overlayBlur) overlayBlur.addEventListener('click', closeMenu);

// Close menu when any mobile nav link is clicked
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMenu();
    closeLB();
  }
});

/* ----------------------------------------------------------
   TEXTILE GALLERY FILTER
   FIX: Uses data-filter attribute on buttons instead of inline onclick
   ---------------------------------------------------------- */
const galleryGrid   = document.getElementById('gallery-grid');
const filterButtons = document.querySelectorAll('[data-filter]');

function filterGallery(cat) {
  const items = galleryGrid ? galleryGrid.querySelectorAll('.g-item') : [];
  items.forEach(item => {
    const itemCat = item.getAttribute('data-cat') || '';
    // Show/hide using display property — works correctly in bento grid
    item.style.display = (cat === 'all' || itemCat === cat) ? '' : 'none';
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Filter items
    filterGallery(btn.getAttribute('data-filter') || 'all');
  });
});

/* ----------------------------------------------------------
   GRAPHIC DESIGN GALLERY FILTER
   FIX: Separate filter system for the new GD section
   ---------------------------------------------------------- */
const gdGrid       = document.getElementById('gd-grid');
const gdFilterBtns = document.querySelectorAll('[data-filter-gd]');

function filterGD(cat) {
  const cards = gdGrid ? gdGrid.querySelectorAll('.gd-card') : [];
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-gd-cat') || '';
    card.style.display = (cat === 'all' || cardCat === cat) ? '' : 'none';
  });
}

gdFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    gdFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterGD(btn.getAttribute('data-filter-gd') || 'all');
  });
});

/* ----------------------------------------------------------
   LIGHTBOX
   FIX: Event delegation instead of inline onclick — survives DOM changes
        and doesn't rely on global function scope
   ---------------------------------------------------------- */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbClose  = document.getElementById('lb-close');

function openLB(src, cat, title) {
  if (!lightbox || !lbImg) return;
  lbImg.src = src;
  lbImg.alt = title || 'Gallery image';
  if (lbCaption) {
    lbCaption.innerHTML = `
      <div style="color:var(--accent);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px">${cat || ''}</div>
      <div style="font-family:var(--serif);font-size:18px;font-style:italic">${title || ''}</div>
    `;
  }
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

let _lbTrigger = null; // tracks which element opened the lightbox

function closeLB() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Restore focus to element that opened the lightbox (accessibility)
  if (_lbTrigger) {
    _lbTrigger.focus();
    _lbTrigger = null;
  }
  // Clear src after transition so browser doesn't hold it in memory
  setTimeout(() => {
    if (lbImg && !lightbox.classList.contains('open')) {
      lbImg.src = '';
    }
  }, 300);
}

// Close when clicking the backdrop
if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLB();
  });
}

// Close button
if (lbClose) {
  lbClose.addEventListener('click', closeLB);
}

// Attach lightbox to textile gallery items via event delegation
if (galleryGrid) {
  galleryGrid.addEventListener('click', e => {
    // Don't open lightbox if user clicked the external Behance link
    if (e.target.closest('.g-link-icon')) return;

    const item = e.target.closest('.g-item');
    if (!item) return;

    // Read data from overlay elements
    const cat   = item.querySelector('.g-cat')?.textContent  || '';
    const name  = item.querySelector('.g-name')?.textContent || '';
    const img   = item.querySelector('img');
    const src   = img ? img.src : '';

    if (src) { _lbTrigger = item; openLB(src, cat, name); }
  });
}

// Also allow graphic design cards to open lightbox
if (gdGrid) {
  gdGrid.addEventListener('click', e => {
    if (e.target.closest('a')) return; // don't block real links
    const card = e.target.closest('.gd-card');
    if (!card) return;

    const tag   = card.querySelector('.gd-tag')?.textContent   || '';
    const title = card.querySelector('.gd-title')?.textContent || '';
    const img   = card.querySelector('img');
    const src   = img ? img.src : '';

    if (src) { _lbTrigger = card; openLB(src, tag, title); }
  });
}

/* ----------------------------------------------------------
   KEYBOARD ACCESSIBILITY — Lightbox trap
   ---------------------------------------------------------- */
if (lightbox) {
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Keep focus inside lightbox
    }
  });
}

/* ----------------------------------------------------------
   SMOOTH SCROLL — polyfill for browsers that ignore css scroll-behavior
   (Optional: only needed for very old browsers)
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ----------------------------------------------------------
   IMAGE ERROR FALLBACK
   Handled via onerror attributes directly in HTML for reliability.
   ---------------------------------------------------------- */

/* ----------------------------------------------------------
   EXPOSE openLB globally ONLY as backward-compat fallback
   (In case any other code references it)
   ---------------------------------------------------------- */
window.openLB = openLB;
