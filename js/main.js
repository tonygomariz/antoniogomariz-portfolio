/**
 * MAIN JAVASCRIPT FILE
 * Antonio Gomariz Portfolio
 * Coordinates all modules and initializes the application
 */

import { utils } from './modules/utils.js';
import { navigation } from './modules/navigation.js';
import { animations } from './modules/animations.js';
import { forms } from './modules/forms.js';

/**
 * Application Class
 * Main controller for the portfolio
 */
class PortfolioApp {
  constructor() {
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  /**
   * Execute when DOM is ready
   */
  onDOMReady() {
    // Initialize utilities
    utils.initLoader();
    utils.initPageTransitions();

    // Initialize navigation
    navigation.init();

    // Initialize animations
    animations.init();

    // Initialize forms
    forms.init();

    // Log success (optional, remove in production)
    console.log('✨ Portfolio initialized successfully');
  }
}

// Initialize the application
const app = new PortfolioApp();

// Export for external access if needed
export default app;
