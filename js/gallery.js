// Optimized gallery.js - maintains functionality with better performance
document.addEventListener('DOMContentLoaded', function() {
  // Gallery variables with existence checks
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  
  const allImages = Array.from(document.querySelectorAll('.carousel-image'));
  const leftBtn = document.querySelector('.left-btn');
  const rightBtn = document.querySelector('.right-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const filterSelect = document.getElementById('filter');
  const imageCounter = document.querySelector('.image-counter');
  
  if (!allImages.length || !lightbox || !lightboxImg) return;
  
  let currentIndex = 0;
  let scale = 1;
  let isAnimating = false; // Prevent rapid-fire transitions
  let carouselWidth = 0;
  
  // Get only the visible images (for filtering)
  function getVisibleImages() {
    return allImages.filter(img => img.style.display !== 'none');
  }
  
  // Progressive image loading with blur effect
  function setupProgressiveLoading() {
    // Create an intersection observer to detect when images enter viewport
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (!img.classList.contains('loaded')) {
            // Add loaded class to remove blur effect when image is fully loaded
            if (img.complete) {
              img.classList.add('loaded');
            } else {
              img.onload = () => {
                img.classList.add('loaded');
              };
            }
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px', // Start loading when within 100px of viewport
      threshold: 0.1
    });
    
    // Observe all carousel images
    allImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Calculate item width - with caching for performance
  let cachedItemWidth = 0;
  let lastWidth = window.innerWidth;
  
  function getItemWidth() {
    // Use cached value if window size hasn't changed
    if (window.innerWidth === lastWidth && cachedItemWidth > 0) {
      return cachedItemWidth;
    }
    
    const visibleImages = getVisibleImages();
    if (visibleImages.length === 0) return 0;
    
    const firstImage = visibleImages[0];
    const style = window.getComputedStyle(firstImage);
    const marginLeft = parseInt(style.marginLeft) || 0;
    const marginRight = parseInt(style.marginRight) || 0;
    
    // Cache the result
    lastWidth = window.innerWidth;
    cachedItemWidth = firstImage.offsetWidth + marginLeft + marginRight;
    
    return cachedItemWidth;
  }
  
  // Update carousel transform with performance optimizations
  function updateCarouselTransform() {
    if (isAnimating) return; // Prevent overlapping animations
    
    const visibleImages = getVisibleImages();
    if (visibleImages.length === 0) return;
    
    const itemWidth = getItemWidth();
    const position = -currentIndex * itemWidth;
    
    isAnimating = true;
    
    // Use requestAnimationFrame for smoother animation
    requestAnimationFrame(() => {
      carousel.style.transition = "transform 0.4s ease-in-out";
      carousel.style.transform = `translateX(${position}px)`;
      
      // Reset animation flag after transition completes
      setTimeout(() => {
        isAnimating = false;
      }, 400);
    });
  }
  
  // Next slide - with checks
  function nextSlide() {
    if (isAnimating) return;
    
    const visibleImages = getVisibleImages();
    if (visibleImages.length === 0) return;
    
    currentIndex = (currentIndex + 1) % visibleImages.length;
    updateCarouselTransform();
  }
  
  // Previous slide - with checks
  function prevSlide() {
    if (isAnimating) return;
    
    const visibleImages = getVisibleImages();
    if (visibleImages.length === 0) return;
    
    currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    updateCarouselTransform();
  }
  
  // Add event listeners with passive option for better performance
  if (leftBtn) leftBtn.addEventListener('click', prevSlide, { passive: true });
  if (rightBtn) rightBtn.addEventListener('click', nextSlide, { passive: true });
  
  // Use event delegation for carousel image clicks
  carousel.addEventListener('click', (event) => {
    if (isAnimating) return;
    
    const img = event.target.closest('.carousel-image');
    if (img && img.style.display !== 'none') {
      const visibleImages = getVisibleImages();
      const index = visibleImages.indexOf(img);
      if (index !== -1) {
        currentIndex = index;
        updateCarouselTransform();
        openLightbox();
      }
    }
  }, { passive: true });
  
  // Open lightbox with optimized transitions
  function openLightbox() {
    const visibleImages = getVisibleImages();
    if (visibleImages.length === 0) return;
    
    // Reset lightbox image transformation
    lightboxImg.style.transform = 'scale(1)';
    scale = 1;
    
    // Store current scroll position and prevent body scrolling
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Update image source before showing lightbox
    const currentImage = visibleImages[currentIndex];
    lightboxImg.src = currentImage.src;
    lightboxImg.alt = currentImage.alt;
    
    // Update counter
    updateCounter();
    
    // Show lightbox with fade-in effect
    lightbox.style.display = 'flex';
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
    });
  }
  
  // Update counter separately for performance
  function updateCounter() {
    const visibleImages = getVisibleImages();
    if (!imageCounter || visibleImages.length === 0) return;
    
    imageCounter.textContent = `${currentIndex + 1} / ${visibleImages.length}`;
  }
  
  // Navigate lightbox with improved transitions
  function navigateLightbox(direction) {
    const visibleImages = getVisibleImages();
    if (visibleImages.length === 0) return;
    
    // Apply brief fade effect
    lightboxImg.style.opacity = '0.5';
    
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % visibleImages.length;
    } else {
      currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    }
    
    // Update carousel position to stay in sync
    updateCarouselTransform();
    
    // Update lightbox image
    const currentImage = visibleImages[currentIndex];
    lightboxImg.src = currentImage.src;
    lightboxImg.alt = currentImage.alt;
    
    // Update counter
    updateCounter();
    
    // Fade image back in
    setTimeout(() => {
      lightboxImg.style.opacity = '1';
    }, 100);
  }
  
  // Close lightbox with clean body style reset
  function closeLightbox() {
    // Start fade-out
    lightbox.classList.remove('active');
    
    // Get scroll position from body style
    const scrollY = parseInt(document.body.style.top || '0') * -1;
    
    // Reset body styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Restore scroll position
    window.scrollTo(0, scrollY);
    
    // Hide lightbox after animation completes
    setTimeout(() => {
      lightbox.style.display = 'none';
    }, 300);
  }
  
  // Lightbox control event listeners with passive option where possible
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox, { passive: true });
  
  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox('prev');
  });
  
  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox('next');
  });
  
  // Optimize filtering with batch DOM updates
  if (filterSelect) {
    filterSelect.addEventListener('change', function() {
      if (isAnimating) return;
      
      const selected = filterSelect.value;
      
      // Use requestAnimationFrame to batch DOM updates
      requestAnimationFrame(() => {
        // First pass - update display property for all images
        allImages.forEach(img => {
          if (selected === 'all' || img.classList.contains(selected)) {
            img.style.display = 'block';
          } else {
            img.style.display = 'none';
          }
        });
        
        // Reset to first image and update carousel
        currentIndex = 0;
        updateCarouselTransform();
      });
    }, { passive: true });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (event) => {
    // Only handle keys when lightbox is visible
    if (lightbox.style.display !== 'flex' && !lightbox.classList.contains('active')) return;
    
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      navigateLightbox('prev');
    } else if (event.key === 'ArrowRight') {
      navigateLightbox('next');
    }
  }, { passive: true });
  
  // Debounced resize handler
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reset cached width on resize
      cachedItemWidth = 0;
      updateCarouselTransform();
    }, 150);
  }
  
  // Initialize gallery
  function initGallery() {
    // Set up progressive image loading
    setupProgressiveLoading();
    
    // Initial carousel positioning without animation
    carousel.style.transition = 'none';
    updateCarouselTransform();
    
    // Force reflow before enabling transitions
    void carousel.offsetWidth;
    carousel.style.transition = '';
    
    // Add resize listener for responsive updates
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Mark sections as visible
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('appear');
    });
  }
  
  // Run initialization
  initGallery();
});
