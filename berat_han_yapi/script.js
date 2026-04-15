/* =============================================
   BERAT HAN YAPI & DEKORASYON — script.js
   ============================================= */

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ---- Counter animation ----
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = '1';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.4 });
counters.forEach(c => counterObserver.observe(c));

// ---- Scroll reveal ----
document.querySelectorAll(
  '.service-card, .portfolio-item, .process-step, .about-text, .about-images, .contact-info, .contact-form, .stat-item'
).forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Portfolio filter ----
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      const match = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hidden', !match);
    });
  });
});

// ---- Testimonial slider ----
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;
let autoSlide;

function goToTestimonial(index) {
  testimonials[currentTestimonial].classList.remove('active');
  dots[currentTestimonial].classList.remove('active');
  currentTestimonial = (index + testimonials.length) % testimonials.length;
  testimonials[currentTestimonial].classList.add('active');
  dots[currentTestimonial].classList.add('active');
}

function startAutoSlide() {
  autoSlide = setInterval(() => goToTestimonial(currentTestimonial + 1), 5000);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoSlide);
    goToTestimonial(+dot.dataset.index);
    startAutoSlide();
  });
});

startAutoSlide();

// ---- Contact form validation ----
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: 'name',    errId: 'nameError',    msg: 'Lütfen adınızı girin.' },
    { id: 'phone',   errId: 'phoneError',   msg: 'Lütfen telefonunuzu girin.' },
    { id: 'message', errId: 'messageError', msg: 'Lütfen mesajınızı yazın.' },
  ];

  fields.forEach(({ id, errId, msg }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    if (!input.value.trim()) {
      input.classList.add('error');
      err.textContent = msg;
      valid = false;
    } else {
      input.classList.remove('error');
      err.textContent = '';
    }
  });

  // Email format check (optional field)
  const emailInput = document.getElementById('email');
  const emailErr   = document.getElementById('emailError');
  if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    emailInput.classList.add('error');
    emailErr.textContent = 'Geçerli bir e-posta adresi girin.';
    valid = false;
  } else {
    emailInput.classList.remove('error');
    emailErr.textContent = '';
  }

  if (valid) {
    form.reset();
    const success = document.getElementById('formSuccess');
    success.style.display = 'block';
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  }
});

// Clear error on input
form.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error');
    const errEl = document.getElementById(input.id + 'Error');
    if (errEl) errEl.textContent = '';
  });
});

// ---- Back to top ----
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Smooth active nav link ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });
