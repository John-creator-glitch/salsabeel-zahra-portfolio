// Nav scroll
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

// Hamburger menu
const hamburger = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlayBlur');

function closeMenu() { 
  mobileMenu.classList.remove('active'); 
  overlay.classList.remove('active'); 
  hamburger.classList.remove('active'); 
  document.body.style.overflow = ''; 
}

function toggleMenu() { 
  mobileMenu.classList.toggle('active'); 
  overlay.classList.toggle('active'); 
  hamburger.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', closeMenu));

// Gallery filter
function filterGallery(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.g-item').forEach(item => { 
    const cats = item.dataset.cat; 
    item.style.display = (cat === 'all' || cats === cat) ? '' : 'none'; 
  });
}

// Lightbox
function openLB(src, cat, title) { 
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const caption = document.getElementById('lb-caption');
  img.src = src;
  caption.innerHTML = `<div style="color:var(--accent);font-size:11px;letter-spacing:0.1em">${cat}</div><div style="font-family:var(--serif);font-size:18px;font-style:italic">${title}</div>`;
  lightbox.classList.add('open'); 
  document.body.style.overflow = 'hidden'; 
}

function closeLB() { 
  document.getElementById('lightbox').classList.remove('open'); 
  document.body.style.overflow = ''; 
}

document.getElementById('lightbox').addEventListener('click', e => { 
  if(e.target === document.getElementById('lightbox')) closeLB(); 
});

document.addEventListener('keydown', e => { 
  if(e.key === 'Escape') closeLB(); 
});
