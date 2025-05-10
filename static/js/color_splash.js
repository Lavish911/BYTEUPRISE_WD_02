document.addEventListener('DOMContentLoaded', function() {
  // Get all elements with the 'tilt-effect' class
  const boxes = document.querySelectorAll('.box');
  const heroHeading = document.querySelector('.hero h2');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  // Add the tilt-effect class to our elements
  boxes.forEach(box => box.classList.add('tilt-effect'));
  portfolioItems.forEach(item => item.classList.add('tilt-effect'));
  if (heroHeading) heroHeading.classList.add('tilt-effect');
  
  // Apply mouse-move 3D tilt effect to elements
  document.addEventListener('mousemove', function(e) {
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    tiltElements.forEach(element => {
      // Get element dimensions and position
      const rect = element.getBoundingClientRect();
      
      // Check if element is in viewport
      if (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
      ) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate mouse position relative to the element center
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate the rotation angle based on mouse position
        // Reduce the effect strength by dividing by a larger number
        // This makes the effect more subtle
        const rotateY = mouseX / 50;
        const rotateX = -mouseY / 50;
        
        // Apply the transformation (but only if mouse is close enough)
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        const maxDistance = Math.max(window.innerWidth, window.innerHeight) / 3;
        
        if (distance < maxDistance) {
          // Calculate strength based on distance (closer = stronger effect)
          const strength = 1 - distance / maxDistance;
          
          // Different transform based on element type
          if (element.classList.contains('portfolio-item')) {
            element.style.transform = `perspective(1000px) rotateX(${rotateX * strength * 0.5}deg) rotateY(${rotateY * strength * 0.5}deg) translateY(-5px)`;
          } else {
            element.style.transform = `perspective(1000px) rotateX(${rotateX * strength}deg) rotateY(${rotateY * strength}deg) scale3d(1.03, 1.03, 1.03)`;
          }
        }
      }
    });
  });
  
  // Reset transform when mouse leaves an element
  document.querySelectorAll('.tilt-effect').forEach(element => {
    element.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
  
  // Add parallax scrolling effect to hero section
  const heroSection = document.querySelector('.hero');
  const floatingElements = document.querySelectorAll('.floating-item');
  
  if (heroSection) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      const parallaxValue = scrollPosition * 0.4;
      
      // Apply parallax to hero background
      heroSection.style.backgroundPosition = `center ${parallaxValue}px`;
      
      // Apply different parallax speeds to floating elements
      floatingElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.1); // Different speed for each element
        element.style.transform = `translate3d(0, ${scrollPosition * speed}px, 0)`;
      });
    });
  }
  
  // Add a more dynamic rainbow animation to the header
  const header = document.querySelector('header h1');
  if (header) {
    // Apply a new class
    header.classList.add('enhanced-rainbow');
  }
  
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for header
          behavior: 'smooth'
        });
      }
    });
  });

  // Animation on scroll - reveal elements when they enter viewport
  const revealElements = document.querySelectorAll('.box, .portfolio-item, .section-title, .about-content');
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observe all elements
  revealElements.forEach(element => {
    element.classList.add('reveal-animation');
    observer.observe(element);
  });
});