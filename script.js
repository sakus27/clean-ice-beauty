const header = document.querySelector('#header');
const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 12);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Menüyü aç' : 'Menüyü kapat');
  mobileNav.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Menüyü aç');
  mobileNav.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelectorAll('[data-service-carousel]').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('.service-card-slider img')];
  const dots = [...carousel.querySelectorAll('.service-dots i')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer;

  const show = nextIndex => {
    current = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle('active', index === current));
    dots.forEach((dot, index) => dot.classList.toggle('active', index === current));
  };

  const start = () => {
    window.clearInterval(timer);
    if (reduceMotion) return;
    timer = window.setInterval(() => show(current + 1), 3800);
  };

  const stop = () => window.clearInterval(timer);
  carousel.querySelector('[data-service-prev]')?.addEventListener('click', () => { show(current - 1); start(); });
  carousel.querySelector('[data-service-next]')?.addEventListener('click', () => { show(current + 1); start(); });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);
  start();
});
