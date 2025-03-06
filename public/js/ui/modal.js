// modal.js - Modal Dialog Management
import { logDebug } from '../utils/debug.js';

// Initialize all modals
export function initModals() {
  const modals = document.querySelectorAll('.modal');
  const closeBtns = document.querySelectorAll('.close');
  const addCourseBtn = document.getElementById('add-course-btn');
  const addAssignmentBtn = document.getElementById('add-assignment-btn');
  const addExamBtn = document.getElementById('add-exam-btn');
  const addMaterialBtn = document.getElementById('add-material-btn');
  
  // Open course modal
  if (addCourseBtn) {
    addCourseBtn.addEventListener('click', function() {
      openModal('add-course-modal');
    });
  }
  
  // Open assignment modal
  if (addAssignmentBtn) {
    addAssignmentBtn.addEventListener('click', function() {
      openModal('add-assignment-modal');
      // Ensure course dropdown is populated
      if (typeof window.populateCoursesDropdown === 'function') {
        window.populateCoursesDropdown();
      }
    });
  }
  
  // Open exam modal
  if (addExamBtn) {
    addExamBtn.addEventListener('click', function() {
      openModal('add-exam-modal');
      // Ensure course dropdown is populated
      if (typeof window.populateCoursesDropdownForExams === 'function') {
        window.populateCoursesDropdownForExams();
      }
    });
  }
  
  // Open material modal
  if (addMaterialBtn) {
    addMaterialBtn.addEventListener('click', function() {
      openModal('add-material-modal');
      // Ensure course dropdown is populated
      if (typeof window.populateCoursesDropdownForMaterials === 'function') {
        window.populateCoursesDropdownForMaterials();
      }
    });
  }
  
  // Close modal with X
  closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = btn.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    modals.forEach(modal => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
  
  logDebug('Modals initialized');
}

// Open a modal by ID
export function openModal(modalId) {
  logDebug(`Opening modal: ${modalId}`);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

// Close a modal by ID
export function closeModal(modalId) {
  logDebug(`Closing modal: ${modalId}`);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}