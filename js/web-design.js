document.addEventListener('DOMContentLoaded', function() {
  // Tech carousel functionality
  const techSlides = document.querySelectorAll('.tech-slide');
  let currentTechSlide = 0;
  let techInterval;

  function showTechSlide(index) {
    // Ensure index is within bounds
    if (index < 0) index = techSlides.length - 1;
    if (index >= techSlides.length) index = 0;
    
    // Remove active class from all slides
    techSlides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Add active class to current slide
    techSlides[index].classList.add('active');
    currentTechSlide = index;
  }

  // Start auto-rotation
  function startTechRotation() {
    techInterval = setInterval(() => {
      showTechSlide(currentTechSlide + 1);
    }, 3000);
  }

  // Stop auto-rotation
  function stopTechRotation() {
    clearInterval(techInterval);
  }

  // Initialize tech carousel
  startTechRotation();

  // Pause auto-play on hover
  document.querySelector('.project-tech').addEventListener('mouseenter', stopTechRotation);
  document.querySelector('.project-tech').addEventListener('mouseleave', startTechRotation);
});