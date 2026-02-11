// js/main.js

// =================================================================
// 1. FIX: BFCache (Pantalla negra al volver atrás)
// =================================================================
window.addEventListener('pageshow', (event) => {
  // Si la página se carga desde la memoria caché (botón atrás/adelante)
  if (event.persisted) {
    const transition = document.querySelector('.page-transition');
    const loader = document.querySelector('.loader');
    
    // Forzamos a quitar la cortina negra
    if (transition) {
      transition.style.transform = ''; // Vuelve al estado original del CSS
      // Por seguridad, forzamos ocultarla
      setTimeout(() => {
         transition.style.opacity = '0';
         transition.style.transform = 'translateY(100%)'; 
      }, 10);
    }
    
    // Aseguramos que el loader no aparezca de nuevo
    if (loader) {
      loader.classList.add('hidden');
      loader.style.display = 'none';
    }
  }
});

// =================================================================
// 2. LOADER INICIAL
// =================================================================
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.style.display = 'none', 500);
    }, 1200);
  }
});

// =================================================================
// 3. MENU MÓVIL
// =================================================================
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

if (menuToggle && navbar) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle('active');
    navbar.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && !navbar.contains(e.target) && !menuToggle.contains(e.target)) {
       navbar.classList.remove('active');
       menuToggle.classList.remove('active');
    }
  });
}

// =================================================================
// 4. TRANSICIONES DE PÁGINA (LINKS)
// =================================================================
document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not(.lightbox-trigger)').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    e.preventDefault();
    
    const transition = document.querySelector('.page-transition');
    // Activamos la cortina
    if (transition) transition.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      window.location.href = href;
    }, 800);
  });
});

// =================================================================
// 5. SMOOTH SCROLL (ANCHORS)
// =================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      if (navbar) navbar.classList.remove('active');
      if (menuToggle) menuToggle.classList.remove('active');
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  });
});

// =================================================================
// 6. ANIMACIONES SCROLL
// =================================================================
const header = document.querySelector('header');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
  if (header) {
    if (window.scrollY > 100) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight - 100) section.classList.add('appear');
  });
});

setTimeout(() => {
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight - 100) section.classList.add('appear');
  });
}, 100);

// =================================================================
// 7. ACTIVE NAVIGATION HIGHLIGHT
// =================================================================
function setActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 200) currentSection = section.getAttribute('id');
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${currentSection}`) item.classList.add('active');
  });
}

window.addEventListener('scroll', setActiveNavigation);
window.addEventListener('load', setActiveNavigation);
