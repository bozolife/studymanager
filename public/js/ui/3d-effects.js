/**
 * 3D Pixelated Effects
 * Adds 3D transformations and pixel art effects to the StudyManager UI
 */

// Export main function to initialize 3D effects
export function initialize3DEffects() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Initializing 3D Pixelated Effects');
      initHeaderEffects();
      initCardEffects();
      initButtonEffects();
      initNavEffects();
      initPixelatedText();
      
      // Apply 3D tilt effect to cards and containers
      document.querySelectorAll('.dashboard-card, .course-card, .material-item, .assignment-item, .exam-item')
        .forEach(card => applyTiltEffect(card));
    });
  }
  
  // Create 3D header effects
  function initHeaderEffects() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const h1 = header.querySelector('h1');
    const p = header.querySelector('p');
    
    if (h1) {
      // Split text into individual letters for animation
      const text = h1.textContent;
      h1.innerHTML = ''; // Clear the current text
      
      // Create spans for each letter with 3D effect
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.display = 'inline-block';
        span.style.transition = 'transform 0.3s ease, color 0.3s ease';
        span.style.transform = `translateZ(${5 + Math.random() * 15}px)`;
        
        // Add hover effect to each letter
        span.addEventListener('mouseover', () => {
          span.style.transform = `translateZ(30px) translateY(-5px)`;
          span.style.color = getRandomPixelColor();
        });
        
        span.addEventListener('mouseout', () => {
          span.style.transform = `translateZ(${5 + Math.random() * 15}px)`;
          span.style.color = '';
        });
        
        h1.appendChild(span);
      }
    }
    
    if (p) {
      p.style.textShadow = '1px 1px 0 rgba(0, 0, 0, 0.2)';
    }
  }
  
  // Apply 3D tilt effect to cards
  function applyTiltEffect(element) {
    element.addEventListener('mousemove', handleTilt);
    element.addEventListener('mouseleave', resetTilt);
  }
  
  // Handle mouse movement for tilt effect
  function handleTilt(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Convert to percentage position (-0.5 to 0.5)
    const percentX = (mouseX / rect.width) - 0.5;
    const percentY = (mouseY / rect.height) - 0.5;
    
    // Apply rotation (reduced effect for subtlety)
    const rotateY = percentX * 10; // 10 degrees max rotation
    const rotateX = percentY * -10; // Negative to tilt correctly
    
    // Apply the transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
  }
  
  // Reset the tilt effect when mouse leaves
  function resetTilt(event) {
    const card = event.currentTarget;
    // Smoothly transition back to original position
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
  }
  
  // Get a random color from the pixel art palette
  function getRandomPixelColor() {
    const colors = [
      '#4361ee', // primary
      '#3f37c9', // secondary
      '#f72585', // accent
      '#4cc9f0', // success
      '#f8961e'  // warning
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Initialize card effects
  function initCardEffects() {
    // Add depth layers to cards for 3D effect
    document.querySelectorAll('.dashboard-card, .course-card').forEach(card => {
      card.classList.add('transform-3d');
      
      // Add card highlight on hover
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
      });
    });
  }
  
  // Initialize button effects
  function initButtonEffects() {
    document.querySelectorAll('.btn').forEach(button => {
      // Add pixel style to buttons
      button.classList.add('pixel-button');
      
      // Button press effect
      button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(3px)';
        button.style.boxShadow = '0 2px 0 rgba(0,0,0,0.2)';
      });
      
      button.addEventListener('mouseup', () => {
        button.style.transform = '';
        button.style.boxShadow = '';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
        button.style.boxShadow = '';
      });
      
      // Add click explosion effect
      button.addEventListener('click', createPixelExplosion);
    });
  }
  
  // Initialize navbar effects
  function initNavEffects() {
    const navItems = document.querySelectorAll('nav a');
    
    navItems.forEach(item => {
      // Add pixel border to nav items
      item.classList.add('nav-pixel');
      
      // Create pixel particles effect on click
      item.addEventListener('click', createPixelExplosion);
    });
  }
  
  // Create pixel explosion effect on interaction
  function createPixelExplosion(event) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    // Create container for pixels
    const pixelContainer = document.createElement('div');
    pixelContainer.classList.add('pixel-explosion');
    pixelContainer.style.position = 'absolute';
    pixelContainer.style.top = `${rect.top}px`;
    pixelContainer.style.left = `${rect.left}px`;
    pixelContainer.style.width = `${rect.width}px`;
    pixelContainer.style.height = `${rect.height}px`;
    pixelContainer.style.pointerEvents = 'none';
    pixelContainer.style.zIndex = '1000';
    
    // Create individual pixels
    for (let i = 0; i < 15; i++) {
      const pixel = document.createElement('div');
      pixel.classList.add('explosion-pixel');
      
      // Random position
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      
      // Random size (2-5px)
      const size = 2 + Math.random() * 3;
      
      // Style pixel
      pixel.style.width = `${size}px`;
      pixel.style.height = `${size}px`;
      pixel.style.backgroundColor = getRandomPixelColor();
      pixel.style.position = 'absolute';
      pixel.style.top = `${y}px`;
      pixel.style.left = `${x}px`;
      
      // Random direction
      pixel.style.setProperty('--direction-x', Math.random() > 0.5 ? 1 : -1);
      pixel.style.setProperty('--direction-y', Math.random() > 0.5 ? 1 : -1);
      pixel.style.setProperty('--rotation', Math.random() > 0.5 ? 1 : -1);
      
      // Animation
      pixel.style.animation = 'pixel-explosion 0.5s forwards';
      
      pixelContainer.appendChild(pixel);
    }
    
    document.body.appendChild(pixelContainer);
    
    // Remove explosion after animation
    setTimeout(() => {
      document.body.removeChild(pixelContainer);
    }, 1000);
  }
  
  // Initialize pixelated text effects
  function initPixelatedText() {
    // Add pixelated style to headings
    document.querySelectorAll('h2, h3').forEach(heading => {
      heading.classList.add('pixel-text');
      
      // Add subtle float animation to headings
      heading.style.animation = 'float 3s ease-in-out infinite';
    });
  }
  
  // Show notification with pixel effect
  export function showPixelNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      // Add exit animation
      notification.classList.add('notification-exit');
      
      // Remove after animation
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Export tilt function for use in other components
  export { applyTiltEffect, createPixelExplosion };