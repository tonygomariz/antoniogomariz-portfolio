/**
 * UTILITY FUNCTIONS
 * General purpose utilities and helpers
 */

export const utils = {
  /**
   * Page Loader
   */
  initLoader() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader) {
          loader.classList.add('hidden');
        }
      }, 1200);
    });
  },

  /**
   * Page Transitions
   * Handles smooth transitions between pages
   */
  initPageTransitions() {
    const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])');
    const transition = document.querySelector('.page-transition');

    if (!transition) return;

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Skip if href is empty or just #
        if (!href || href === '#') return;

        e.preventDefault();

        transition.style.transform = 'translateY(0)';

        setTimeout(() => {
          window.location.href = href;
        }, 800);
      });
    });
  },

  /**
   * Debounce function for performance optimization
   */
  debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function for performance optimization
   */
  throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element, offset = 100) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom > 0
    );
  },

  /**
   * Smooth scroll to element
   */
  scrollToElement(target, offset = 100) {
    if (!target) return;

    const targetPosition = target.offsetTop - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};
