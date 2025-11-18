// Page loader
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loader').classList.add('hidden');
  }, 1200);
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navbar.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuToggle.classList.remove('active');
  });
});

// Page transitions for links
document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    e.preventDefault();
    
    const transition = document.querySelector('.page-transition');
    transition.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      window.location.href = href;
    }, 800);
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Close mobile menu if open
      navbar.classList.remove('active');
      menuToggle.classList.remove('active');
      
      // Scroll to the target
      window.scrollTo({
        top: targetElement.offsetTop - 100, // Offset for fixed header
        behavior: 'smooth'
      });
    }
  });
});

// Scroll animations
const header = document.querySelector('header');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
  // Header scroll effect
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Section appear effect
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight - 100) {
      section.classList.add('appear');
    }
  });
});

// Trigger appear effect immediately for visible sections
setTimeout(() => {
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight - 100) {
      section.classList.add('appear');
    }
  });
}, 100);

// Contact form submission handler with AJAX
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const formMessage = document.getElementById('formMessage');
  
  // Function to show messages
  function showMessage(text, type) {
    if (!formMessage) return;
    
    formMessage.textContent = text;
    formMessage.className = 'form-message';
    formMessage.classList.add(type);
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  }
  
  // Function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Submit event handler
  contactForm.addEventListener('submit', async function(e) {
    // CRITICAL: Prevent default form submission
    e.preventDefault();
    
    // Get field values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Field validation
    if (!name || !email || !subject || !message) {
      showMessage('Please fill in all fields.', 'error');
      return;
    }
    
    // Email validation
    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    // Show sending message
    showMessage('Sending message...', 'info');
    
    // Disable submit button to prevent multiple submissions
    const submitButton = contactForm.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    try {
      // Prepare form data for Netlify
      const formData = new FormData(contactForm);
      const searchParams = new URLSearchParams(formData);
      
      // Make AJAX request to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
      });
      
      // Check if response was successful
      if (response.ok) {
        // Success: redirect to thank you page
        window.location.href = '/thank-you.html';
      } else {
        // Server error
        throw new Error('Server error');
      }
      
    } catch (error) {
      // Error handling
      console.error('Form submission error:', error);
      showMessage('There was an error sending your message. Please try again.', 'error');
      
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  });
}

// Setup active navigation based on scroll position
function setActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop - 200) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${currentSection}`) {
      item.classList.add('active');
    }
  });
}

// Call on scroll and on load
window.addEventListener('scroll', setActiveNavigation);
window.addEventListener('load', setActiveNavigation);