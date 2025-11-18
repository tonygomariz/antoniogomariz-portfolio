/**
 * NAVIGATION MODULE
 * Handles header, mobile menu, and smooth scrolling
 */

export const navigation = {
  menuToggle: null,
  navbar: null,
  header: null,
  navLinks: null,

  /**
   * Initialize navigation
   */
  init() {
    this.cacheDOM();
    this.bindEvents();
    this.setActiveNavOnLoad();
  },

  /**
   * Cache DOM elements
   */
  cacheDOM() {
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navbar = document.querySelector('.navbar');
    this.header = document.querySelector('header');
    this.navLinks = document.querySelectorAll('.navbar a');
    this.navItems = document.querySelectorAll('.nav-item');
  },

  /**
   * Bind events
   */
  bindEvents() {
    // Mobile menu toggle
    if (this.menuToggle && this.navbar) {
      this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
    });

    // Header scroll effect
    window.addEventListener('scroll', () => this.handleHeaderScroll(), { passive: true });

    // Active navigation on scroll
    window.addEventListener('scroll', () => this.setActiveNavigation(), { passive: true });
  },

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    this.menuToggle.classList.toggle('active');
    this.navbar.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (this.navbar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    if (this.navbar && this.menuToggle) {
      this.navbar.classList.remove('active');
      this.menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  /**
   * Handle anchor link clicks
   */
  handleAnchorClick(e) {
    e.preventDefault();

    const targetId = e.currentTarget.getAttribute('href');

    // Skip if href is just #
    if (targetId === '#' || targetId === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      this.closeMobileMenu();

      const headerHeight = this.header ? this.header.offsetHeight : 80;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  },

  /**
   * Handle header scroll effect
   */
  handleHeaderScroll() {
    if (!this.header) return;

    if (window.scrollY > 100) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  },

  /**
   * Set active navigation based on scroll position
   */
  setActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop - 200) {
        currentSection = section.getAttribute('id');
      }
    });

    this.navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  },

  /**
   * Set active nav on page load
   */
  setActiveNavOnLoad() {
    setTimeout(() => this.setActiveNavigation(), 100);
  }
};
