/**
 * FORMS MODULE
 * Handles form validation and submission
 */

export const forms = {
  contactForm: null,
  formMessage: null,

  /**
   * Initialize forms
   */
  init() {
    this.cacheDOM();
    this.bindEvents();
  },

  /**
   * Cache DOM elements
   */
  cacheDOM() {
    this.contactForm = document.getElementById('contactForm');
    this.formMessage = document.getElementById('formMessage');
  },

  /**
   * Bind events
   */
  bindEvents() {
    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Show form message
   */
  showMessage(text, type) {
    if (!this.formMessage) return;

    this.formMessage.textContent = text;
    this.formMessage.className = 'form-message';
    this.formMessage.classList.add(type);
    this.formMessage.style.display = 'block';

    // Auto-hide after 5 seconds for non-error messages
    if (type !== 'error') {
      setTimeout(() => {
        this.formMessage.style.display = 'none';
      }, 5000);
    }
  },

  /**
   * Hide form message
   */
  hideMessage() {
    if (this.formMessage) {
      this.formMessage.style.display = 'none';
    }
  },

  /**
   * Validate form fields
   */
  validateForm(formData) {
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();

    // Check if all fields are filled
    if (!name || !email || !subject || !message) {
      this.showMessage('Please fill in all fields.', 'error');
      return false;
    }

    // Validate email
    if (!this.isValidEmail(email)) {
      this.showMessage('Please enter a valid email address.', 'error');
      return false;
    }

    // Validate message length
    if (message.length < 10) {
      this.showMessage('Message must be at least 10 characters long.', 'error');
      return false;
    }

    return true;
  },

  /**
   * Handle form submission
   */
  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.contactForm);

    // Validate form
    if (!this.validateForm(formData)) {
      return;
    }

    // Show sending message
    this.showMessage('Sending message...', 'info');

    // Disable submit button
    const submitButton = this.contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      // Convert FormData to JSON
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };

      // Send to Vercel API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        this.contactForm.reset();

        // Optional: Redirect to thank you page after a delay
        setTimeout(() => {
          window.location.href = '/thank-you.html';
        }, 1500);
      } else {
        // Server error
        throw new Error(result.message || 'Failed to send message');
      }

    } catch (error) {
      // Error handling
      console.error('Form submission error:', error);
      this.showMessage(
        'There was an error sending your message. Please try again or contact me directly via social media.',
        'error'
      );
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
};
