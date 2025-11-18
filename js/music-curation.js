document.addEventListener('DOMContentLoaded', function() {
    // Music carousel functionality
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;
  
    function showSlide(index) {
      // Ensure index is within bounds
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      // Remove active class from all slides
      slides.forEach(slide => {
        slide.classList.remove('active');
      });
      
      // Add active class to current slide
      slides[index].classList.add('active');
      currentSlide = index;
    }
  
    // Previous button click
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      stopSlideshow();
      startSlideshow();
    });
  
    // Next button click
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      stopSlideshow();
      startSlideshow();
    });
  
    // Start auto-play
    function startSlideshow() {
      slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 5000);
    }
  
    // Stop auto-play
    function stopSlideshow() {
      clearInterval(slideInterval);
    }
  
    // Pause auto-play on hover
    document.querySelector('.carousel-container').addEventListener('mouseenter', stopSlideshow);
    document.querySelector('.carousel-container').addEventListener('mouseleave', startSlideshow);
  
    // Initialize slideshow
    startSlideshow();
  
    // Lightbox functionality
    const lightbox = document.getElementById('musicLightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevLightboxBtn = document.querySelector('.prev-lightbox');
    const nextLightboxBtn = document.querySelector('.next-lightbox');
    const lightboxCounter = document.querySelector('.lightbox-counter');
    let currentLightboxIndex = 0;
    
    // Get all slide images
    const slideImages = Array.from(slides).map(slide => {
      return slide.querySelector('img').src;
    });
    
    // Function to open lightbox
    function openLightbox(index) {
      lightboxImg.src = slideImages[index];
      lightbox.classList.add('active');
      currentLightboxIndex = index;
      updateCounter();
      
      // Stop slideshow when lightbox is open
      stopSlideshow();
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    }
    
    // Function to close lightbox
    function closeLightboxFn() {
      lightbox.classList.remove('active');
      
      // Restart slideshow
      startSlideshow();
      
      // Re-enable body scrolling
      document.body.style.overflow = '';
    }
    
    // Function to update counter
    function updateCounter() {
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${slideImages.length}`;
    }
    
    // Add click event to all carousel images
    slides.forEach((slide, index) => {
      slide.querySelector('img').addEventListener('click', () => {
        openLightbox(index);
      });
    });
    
    // Close lightbox when clicking the close button
    closeLightbox.addEventListener('click', closeLightboxFn);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightboxFn();
      }
    });
    
    // Navigate to previous image
    prevLightboxBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex - 1 + slideImages.length) % slideImages.length;
      lightboxImg.src = slideImages[currentLightboxIndex];
      updateCounter();
    });
    
    // Navigate to next image
    nextLightboxBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex + 1) % slideImages.length;
      lightboxImg.src = slideImages[currentLightboxIndex];
      updateCounter();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightboxFn();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxBtn.click();
      } else if (e.key === 'ArrowRight') {
        nextLightboxBtn.click();
      }
    });
  });