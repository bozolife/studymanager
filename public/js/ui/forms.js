// forms.js - Form Handling and Validation
import { logDebug } from '../utils/debug.js';
import { addCourse } from '../components/courses.js';
import { addAssignment } from '../components/assignments.js';
import { addExam, populateCoursesDropdownForExams } from '../components/exams.js';
import { addMaterial, populateCoursesDropdownForMaterials } from '../components/materials.js';

// Initialize form handlers
export function initFormHandlers() {
  const addCourseForm = document.getElementById('add-course-form');
  const addAssignmentForm = document.getElementById('add-assignment-form');
  const addExamForm = document.getElementById('add-exam-form');
  const addMaterialForm = document.getElementById('add-material-form');
  
  // Course form
  if (addCourseForm) {
    addCourseForm.addEventListener('submit', function(e) {
      e.preventDefault();
      logDebug('Course form submitted');
      
      // Extract form data
      const formData = {
        name: document.getElementById('course-name').value,
        code: document.getElementById('course-code').value,
        credits: parseInt(document.getElementById('course-credits').value),
        start_date: document.getElementById('course-start').value,
        end_date: document.getElementById('course-end').value,
        status: document.getElementById('course-status').value
      };
      
      // Validate form data
      if (validateCourseForm(formData)) {
        addCourse(formData);
      }
    });
  }
  
  // Assignment form
  if (addAssignmentForm) {
    addAssignmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      logDebug('Assignment form submitted');
      
      // Extract form data
      const formData = {
        title: document.getElementById('assignment-title').value,
        description: document.getElementById('assignment-description').value,
        course_id: parseInt(document.getElementById('assignment-course').value),
        due_date: document.getElementById('assignment-due').value,
        status: document.getElementById('assignment-status').value
      };
      
      // Validate form data
      if (validateAssignmentForm(formData)) {
        addAssignment(formData);
      }
    });
  }
  
  // Exam form
  if (addExamForm) {
    // Show/hide grade field based on status
    const examStatus = document.getElementById('exam-status');
    const gradeContainer = document.querySelector('.exam-grade-container');
    
    if (examStatus && gradeContainer) {
      examStatus.addEventListener('change', function() {
        if (this.value === 'passed' || this.value === 'failed') {
          gradeContainer.style.display = 'block';
        } else {
          gradeContainer.style.display = 'none';
        }
      });
    }
    
    addExamForm.addEventListener('submit', function(e) {
      e.preventDefault();
      logDebug('Exam form submitted');
      
      // Get the exam date value
      const examDateInput = document.getElementById('exam-date').value;
      logDebug(`Raw exam date from form: ${examDateInput}`);
      
      // Extract form data with the correct field name (date)
      const formData = {
        title: document.getElementById('exam-title').value,
        course_id: parseInt(document.getElementById('exam-course').value),
        date: examDateInput, // This must match the database column name in your API
        duration: document.getElementById('exam-duration').value || null,
        location: document.getElementById('exam-location').value,
        status: document.getElementById('exam-status').value
      };
      
      // Add grade if status is passed or failed
      if (formData.status === 'passed' || formData.status === 'failed') {
        formData.grade = document.getElementById('exam-grade').value || null;
      }
      
      // Debug log the final data
      logDebug('Exam data to be submitted:');
      logDebug(JSON.stringify(formData));
      
      // Validate form data
      if (validateExamForm(formData)) {
        addExam(formData);
      }
    });
  }
  
  // Material form
  if (addMaterialForm) {
    addMaterialForm.addEventListener('submit', function(e) {
      e.preventDefault();
      logDebug('Material form submitted');
      
      // Extract form data
      const formData = {
        title: document.getElementById('material-title').value,
        description: document.getElementById('material-description').value,
        course_id: parseInt(document.getElementById('material-course').value),
        type: document.getElementById('material-type').value,
        url: document.getElementById('material-url').value,
        is_required: document.getElementById('material-required').checked
      };
      
      // Validate form data
      if (validateMaterialForm(formData)) {
        addMaterial(formData);
      }
    });
  }
  
  // Setup modal buttons to populate course dropdowns
  const addExamBtn = document.getElementById('add-exam-btn');
  if (addExamBtn) {
    addExamBtn.addEventListener('click', populateCoursesDropdownForExams);
  }
  
  const addMaterialBtn = document.getElementById('add-material-btn');
  if (addMaterialBtn) {
    addMaterialBtn.addEventListener('click', populateCoursesDropdownForMaterials);
  }
  
  logDebug('Form handlers initialized');
}

// Validate course form
function validateCourseForm(data) {
  if (!data.name || !data.code || !data.credits || !data.start_date || !data.end_date) {
    alert('Please fill all required fields');
    return false;
  }
  
  if (data.credits <= 0) {
    alert('Credits must be greater than 0');
    return false;
  }
  
  if (new Date(data.end_date) <= new Date(data.start_date)) {
    alert('End date must be after start date');
    return false;
  }
  
  return true;
}

// Validate assignment form
function validateAssignmentForm(data) {
  if (!data.title || !data.course_id || !data.due_date) {
    alert('Please fill all required fields');
    return false;
  }
  
  if (isNaN(data.course_id) || data.course_id <= 0) {
    alert('Please select a valid course');
    return false;
  }
  
  return true;
}

// Validate exam form
function validateExamForm(data) {
  if (!data.title || !data.course_id || !data.date) { // Updated to match the date field name
    alert('Please fill all required fields');
    return false;
  }
  
  if (isNaN(data.course_id) || data.course_id <= 0) {
    alert('Please select a valid course');
    return false;
  }
  
  // If duration is provided, it must be positive
  if (data.duration && parseInt(data.duration) <= 0) {
    alert('Duration must be greater than 0 minutes');
    return false;
  }
  
  // If grade is provided, validate it
  if (data.grade) {
    const grade = parseFloat(data.grade);
    if (isNaN(grade) || grade < 1.0 || grade > 5.0) {
      alert('Grade must be between 1.0 and 5.0');
      return false;
    }
  }
  
  return true;
}

// Validate material form
function validateMaterialForm(data) {
  if (!data.title || !data.course_id || !data.type) {
    alert('Please fill all required fields');
    return false;
  }
  
  if (isNaN(data.course_id) || data.course_id <= 0) {
    alert('Please select a valid course');
    return false;
  }
  
  // If URL is provided, validate it
  if (data.url && !isValidURL(data.url)) {
    alert('Please enter a valid URL');
    return false;
  }
  
  return true;
}

// Validate URL helper function
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}