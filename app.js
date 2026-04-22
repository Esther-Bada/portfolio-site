/* ============================================================
   NAV — mobile toggle + active link on scroll
   ============================================================ */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('is-open');
});

// Close mobile nav when a link is clicked
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Highlight active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ============================================================
   SCROLL REVEAL — staggered Intersection Observer
   ============================================================ */

// Pre-compute stagger delays: elements within the same .container
// get progressive delays (80 ms apart) based on their DOM order.
document.querySelectorAll('.container').forEach(container => {
  container.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.revealDelay = (i * 0.08).toFixed(2);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = entry.target.dataset.revealDelay || 0;
      entry.target.style.transitionDelay = `${delay}s`;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   STAT COUNTER — about page only
   ============================================================ */
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;

      statsSection.querySelectorAll('.stat-number').forEach(el => {
        const text  = el.textContent.trim();
        const match = text.match(/^(\d+)(.*)/);

        // ∞ or any non-numeric value — leave as-is (fades in via .reveal)
        if (!match) return;

        const target   = parseInt(match[1], 10);
        const suffix   = match[2]; // e.g. "st" for "1st", "" for "3"
        const duration = 2000;
        const t0       = performance.now();

        (function tick(now) {
          const t      = Math.min((now - t0) / duration, 1);
          const eased  = 1 - Math.pow(1 - t, 3); // cubic ease-out
          el.textContent = Math.round(eased * target) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        })(performance.now());
      });

      counterObserver.unobserve(statsSection);
    },
    { threshold: 0.5 }
  );

  counterObserver.observe(statsSection);
}

/* ============================================================
   FOOTER — dynamic year
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();