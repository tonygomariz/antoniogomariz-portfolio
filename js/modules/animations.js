/**
 * ANIMATIONS MODULE
 * Handles scroll animations and visual effects
 */

import { utils } from './utils.js';

export const animations = {
  sections: null,
  observer: null,

  /**
   * Initialize animations
   */
  init() {
    this.cacheDOM();
    this.initScrollAnimations();
    this.initIntersectionObserver();
  },

  /**
   * Cache DOM elements
   */
  cacheDOM() {
    this.sections = document.querySelectorAll('.section');
  },

  /**
   * Initialize scroll-based animations
   */
  initScrollAnimations() {
    // Throttled scroll handler for performance
    const handleScroll = utils.throttle(() => {
      this.revealSections();
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Trigger on load
    setTimeout(() => this.revealSections(), 100);
  },

  /**
   * Reveal sections on scroll
   */
  revealSections() {
    this.sections.forEach(section => {
      if (utils.isInViewport(section, 100)) {
        section.classList.add('appear');
      }
    });
  },

  /**
   * Initialize Intersection Observer for better performance
   * Modern approach for scroll-based animations
   */
  initIntersectionObserver() {
    // Check if browser supports IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback to scroll listener (already initialized)
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          // Optionally unobserve after animation
          // this.observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections
    this.sections.forEach(section => {
      this.observer.observe(section);
    });
  },

  /**
   * Add stagger animation to children
   */
  staggerChildren(parentSelector, childSelector, animationClass = 'fade-in', delay = 100) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    const children = parent.querySelectorAll(childSelector);

    children.forEach((child, index) => {
      child.style.animationDelay = `${index * delay}ms`;
      child.classList.add(animationClass);
    });
  },

  /**
   * Parallax effect for images
   */
  initParallax(selector = '.parallax') {
    const parallaxElements = document.querySelectorAll(selector);

    if (parallaxElements.length === 0) return;

    const handleParallax = utils.throttle(() => {
      parallaxElements.forEach(element => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        element.style.transform = `translate3d(0, ${rate}px, 0)`;
      });
    }, 10);

    window.addEventListener('scroll', handleParallax, { passive: true });
  },

  /**
   * Cleanup observers on page unload
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};
