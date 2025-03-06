// main.js - StudyManager Application Entry Point
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

document.addEventListener('DOMContentLoaded', function() {
  // Initialize application
  async function init() {
    logDebug('Initializing application...');
    
    // Initialize UI components
    initDebugPanel();
    initNavigation();
    initModals();
    initFormHandlers();
    
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
      
      logDebug('Application initialized successfully');
    } else {
      logDebug('Application initialization failed due to API connection issues');
    }
  }
  
  // Start the application
  init();
});