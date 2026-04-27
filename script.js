// ---- Navbar scroll ----

const navbar = document.getElementById('navbar');
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  if (backToTopBtn) {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
});


// ---- Hamburger menu ----

const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navOverlay  = document.getElementById('navOverlay');

function openMenu() {
  if (navLinks) navLinks.classList.add('open');
  if (hamburger) hamburger.classList.add('active');
  if (navOverlay) navOverlay.classList.add('active');
}

function closeMenu() {
  if (navLinks) navLinks.classList.remove('open');
  if (hamburger) hamburger.classList.remove('active');
  if (navOverlay) navOverlay.classList.remove('active');
  // Dropdown da kapat
  const openDropdown = document.querySelector('.dropdown.open');
  if (openDropdown) openDropdown.classList.remove('open');
}

// Mobil dropdown toggle - ÖNCE BU
const dropdownBtn = document.querySelector('.dropdown .dropbtn');
if (dropdownBtn) {
  dropdownBtn.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      const dropdown = dropdownBtn.closest('.dropdown');
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      
      dropdown.classList.toggle('open');
      
      const isOpen = dropdown.classList.contains('open');
      console.log('=== DROPDOWN DEBUG ===');
      console.log('Dropdown toggled:', isOpen);
      console.log('Dropdown element:', dropdown);
      console.log('Dropdown menu:', dropdownMenu);
      console.log('Dropdown menu display:', window.getComputedStyle(dropdownMenu).display);
      console.log('Dropdown menu height:', dropdownMenu.offsetHeight);
      console.log('=====================');
    }
  });
}

if (hamburger && navLinks && navOverlay) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  navOverlay.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a:not(.dropbtn)').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}


// ---- Fix: Prevent default for all screen sizes ----
const allDropdownBtns = document.querySelectorAll('.dropdown .dropbtn');
allDropdownBtns.forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault(); // Her zaman defaultu engelle
    if (window.innerWidth <= 768) {
      e.stopPropagation();
      const dropdown = btn.closest('.dropdown');
      dropdown.classList.toggle('open');
    }
  });
})


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
      const match = filter === 'all' || item.dataset.cat.includes(filter);
      item.classList.toggle('hidden', !match);
    });
  });
});


// ---- Testimonial slider ----

const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;
let autoSlide;

if (testimonials.length > 0 && dots.length > 0) {
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
}


// ---- Contact form validation ----

const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', (e) => {
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

    if (!valid) {
      e.preventDefault();
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
}


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


// ---- Back to top ----

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    const start = window.scrollY;
    const duration = 600; // 1 saniye
    const startTime = performance.now();

    function scrollStep(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeInOut
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, start * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  });
}

// ---- Dropdown click + outside close ----

const dropdown = document.querySelector('.dropdown');

if (dropdown) {
  const dropbtn = dropdown.querySelector('.dropbtn');

  dropbtn.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}

