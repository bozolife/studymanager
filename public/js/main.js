// main.js - StudyManager Application Entry Point with 3D Pixelated UI
import { testAPI } from './api.js';
import { initDebugPanel, logDebug } from './utils/debug.js';
import { initNavigation } from './utils/navigation.js';
import { initModals } from './ui/modal.js';
import { initStudyTimeChart } from './ui/chart.js';
import { initFormHandlers } from './ui/forms.js';
import { loadCourses, renderCourses, renderCurrentCourses } from './components/courses.js';
import { loadAssignments, renderAssignments, renderUpcomingAssignments } from './components/assignments.js';
import { loadExams, renderExams, renderUpcomingExams } from './components/exams.js';
import { loadMaterials, renderMaterials } from './components/materials.js';
import { initialize3DEffects } from './ui/3d-effects.js';
import { initializePixelCharts } from './ui/pixelated-charts.js';

document.addEventListener('DOMContentLoaded', function() {
  // Initialize application
  async function init() {
    logDebug('Initializing application...');
    
    // Initialize UI components
    initDebugPanel();
    initNavigation();
    initModals();
    initFormHandlers();
    
    // Initialize 3D Pixelated UI Enhancements
    logDebug('Initializing 3D Pixelated UI...');
    try {
      initialize3DEffects();
      initializePixelCharts();
      logDebug('3D Pixelated UI initialized successfully');
    } catch (error) {
      logDebug(`3D Effects initialization error: ${error.message}`);
    }
    
    // Test API connection
    const apiConnected = await testAPI();
    if (apiConnected) {
      try {
        // Initialize chart (but don't let errors stop us)
        initStudyTimeChart();
      } catch (error) {
        logDebug(`Chart initialization error: ${error.message}`);
      }
      
      // Load data regardless of chart errors
      await loadCourses();
      await loadAssignments();
      await loadExams();
      await loadMaterials();
      
      // Apply 3D effects to loaded content
      applyPixelEffectsToContent();
      
      logDebug('Application initialized successfully');
    } else {
      logDebug('Application initialization failed due to API connection issues');
    }
  }
  
  // Apply pixel effects to dynamically loaded content
  function applyPixelEffectsToContent() {
    try {
      // Add 3D tilt effect to cards
      document.querySelectorAll('.dashboard-card, .course-card').forEach(card => {
        card.classList.add('transform-3d');
      });
      
      // Add pixelated animations to status indicators
      document.querySelectorAll('.status').forEach(status => {
        status.classList.add('pixel-status');
      });
      
      // Add float animation to important elements
      document.querySelectorAll('.upcoming-deadline, .important-note').forEach(el => {
        el.classList.add('float');
      });
      
      // Add pixel explosion effect to action buttons
      document.querySelectorAll('.btn, button:not(.close)').forEach(btn => {
        btn.classList.add('pixel-button');
        btn.addEventListener('click', createPixelExplosion);
      });
      
      logDebug('Applied 3D pixel effects to content');
    } catch (error) {
      logDebug(`Error applying pixel effects: ${error.message}`);
    }
  }
  
  // Create pixel explosion effect on click
  function createPixelExplosion(event) {
    if (!event.currentTarget.classList.contains('pixel-button')) return;
    
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
      
      // Random color from pixel art palette
      const colors = ['#4361ee', '#3f37c9', '#f72585', '#4cc9f0', '#f8961e'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Style pixel
      pixel.style.width = `${size}px`;
      pixel.style.height = `${size}px`;
      pixel.style.backgroundColor = color;
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
  
  // Start the application
  init();
});