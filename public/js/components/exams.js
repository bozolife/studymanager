// exams.js - Exam Components
import { logDebug } from '../utils/debug.js';
import { fetchData, postData } from '../api.js';
import { formatDate } from '../utils/formatters.js';
import { closeModal } from '../ui/modal.js';
import { getCourses } from './courses.js';

// Store for exam data
let exams = [];

// Get all exams
export function getExams() {
  return exams;
}

// Load exams from API
export async function loadExams() {
  try {
    logDebug('Loading exams...');
    
    // Fetch exams from API
    exams = await fetchData('exams');
    logDebug(`Loaded ${exams.length} exams`);
    
    // Debug log exams to check date and status
    logDebug('Exams data:');
    exams.forEach(exam => {
      logDebug(`Exam: ${exam.title}, Date: ${exam.date}, Status: ${exam.status}`);
    });
    
    // Render exams in UI
    renderExams();
    renderUpcomingExams();
    return true;
  } catch (error) {
    logDebug(`Error loading exams: ${error.message}`);
    const examsContainer = document.getElementById('exams-container');
    if (examsContainer) {
      examsContainer.innerHTML = '<p>Error loading exams. Please try again.</p>';
    }
    return false;
  }
}

// Render exams list
export function renderExams() {
  const examsContainer = document.getElementById('exams-container');
  if (!examsContainer) return;
  
  if (exams.length === 0) {
    examsContainer.innerHTML = '<p>No exams found. Add your first exam.</p>';
    return;
  }
  
  // Get courses for course names
  const courses = getCourses();
  
  let html = '';
  exams.forEach(exam => {
    // Get status class
    const statusClass = getExamStatusClass(exam.status);
    
    // Find course name from course_id
    let courseName = 'Unknown Course';
    if (exam.course_name) {
      courseName = exam.course_name;
    } else if (exam.course_id) {
      const course = courses.find(c => c.id === exam.course_id);
      if (course) {
        courseName = course.name;
      }
    }
    
    // Format duration if available
    let durationText = '';
    if (exam.duration) {
      const hours = Math.floor(exam.duration / 60);
      const minutes = exam.duration % 60;
      durationText = hours > 0 
        ? `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`
        : `${minutes}m`;
    }
    
    // Format grade if available
    const gradeDisplay = exam.grade ? `Grade: ${exam.grade}` : '';
    
    html += `
      <div class="exam-item transform-3d">
        <div class="exam-status ${statusClass}"></div>
        <div class="exam-info">
          <span class="exam-title">${exam.title}</span>
          <span class="exam-course">${courseName}</span>
        </div>
        <div class="exam-details">
          <div>Date: ${formatDate(exam.date)}</div>
          ${exam.location ? `<div>Location: ${exam.location}</div>` : ''}
          ${durationText ? `<div>Duration: ${durationText}</div>` : ''}
          ${gradeDisplay ? `<div>${gradeDisplay}</div>` : ''}
        </div>
        <div class="exam-actions">
          <button class="btn btn-sm pixel-button" onclick="viewExamDetails(${exam.id})">Details</button>
          <button class="btn btn-sm btn-danger pixel-button" onclick="deleteExam(${exam.id})">Delete</button>
        </div>
      </div>
    `;
  });
  
  examsContainer.innerHTML = html;
  logDebug('Exams rendered');
  
  // Apply 3D effects if available
  if (typeof applyTiltEffect === 'function') {
    document.querySelectorAll('.exam-item').forEach(item => {
      applyTiltEffect(item);
    });
  }
}

// Get exam status class
function getExamStatusClass(status) {
  switch (status) {
    case 'upcoming':
      return 'upcoming'; // Changed to match new CSS classes
    case 'completed':
      return 'completed';
    case 'passed':
      return 'passed';
    case 'failed':
      return 'failed';
    default:
      return 'upcoming';
  }
}

// Render upcoming exams on dashboard
export function renderUpcomingExams() {
  const upcomingExamsEl = document.getElementById('upcoming-exams');
  if (!upcomingExamsEl) return;
  
  if (exams.length === 0) {
    upcomingExamsEl.innerHTML = '<p>No upcoming exams found.</p>';
    return;
  }
  
  // Filter for upcoming exams - using date field from DB
  const now = new Date();
  const upcoming = exams
    .filter(exam => {
      // Debug log to help troubleshoot upcoming exam detection
      const examDate = new Date(exam.date);
      logDebug(`Exam ${exam.title}: Date=${exam.date}, Status=${exam.status}, IsUpcoming=${examDate > now && exam.status === 'upcoming'}`);
      
      // Now properly check both date and status
      return examDate > now && exam.status === 'upcoming';
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
  
  if (upcoming.length === 0) {
    upcomingExamsEl.innerHTML = '<p>No upcoming exams found.</p>';
    return;
  }
  
  // Enhanced upcoming exams display
  let html = '<div class="dashboard-exam-list">';
  upcoming.forEach(exam => {
    // Calculate days until exam
    const examDate = new Date(exam.date);
    const daysUntil = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
    
    // Format days until text
    let daysUntilText;
    if (daysUntil === 0) {
      daysUntilText = 'Today!';
    } else if (daysUntil === 1) {
      daysUntilText = 'Tomorrow';
    } else {
      daysUntilText = `In ${daysUntil} days`;
    }
    
    html += `
      <div class="upcoming-exam transform-3d">
        <div class="exam-title">${exam.title}</div>
        <div class="exam-meta">
          <span class="exam-course">${exam.course_name || 'Unknown Course'}</span>
          <span class="exam-countdown float">${daysUntilText}</span>
        </div>
        <div class="exam-date">
          <i class="fas fa-calendar-alt"></i> 
          ${formatDate(exam.date)}
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  upcomingExamsEl.innerHTML = html;
  logDebug('Upcoming exams rendered');
}

// Populate courses dropdown for exam form
export function populateCoursesDropdownForExams() {
  const courseSelect = document.getElementById('exam-course');
  if (!courseSelect) return;
  
  const courses = getCourses();
  
  let options = '<option value="">Select a course</option>';
  courses.forEach(course => {
    options += `<option value="${course.id}">${course.name} (${course.code})</option>`;
  });
  
  courseSelect.innerHTML = options;
  logDebug('Courses dropdown for exams populated');
}

// Add a new exam
export async function addExam(examData) {
  logDebug('Adding new exam:');
  logDebug(examData);
  
  try {
    // Post exam to API
    const exam = await postData('exams', examData);
    logDebug('Exam added successfully:');
    logDebug(exam);
    
    // Reload exams to get updated data with course names
    await loadExams();
    
    // Close modal and reset form
    closeModal('add-exam-modal');
    document.getElementById('add-exam-form').reset();
    
    // Use notification if available
    if (typeof showPixelNotification === 'function') {
      showPixelNotification('Exam added successfully!', 'success');
    } else {
      alert('Exam added successfully!');
    }
  } catch (error) {
    logDebug(`Error adding exam: ${error.message}`);
    
    // Use notification if available
    if (typeof showPixelNotification === 'function') {
      showPixelNotification(`Error adding exam: ${error.message}`, 'error');
    } else {
      alert(`Error adding exam: ${error.message}`);
    }
  }
}

// Delete an exam
export async function deleteExam(examId) {
  if (!confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
    return;
  }
  
  logDebug(`Deleting exam ID: ${examId}`);
  
  try {
    // Delete from API
    const response = await fetch(`/api/exams/${examId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete exam');
    }
    
    // Remove from local array
    exams = exams.filter(exam => exam.id !== examId);
    
    // Re-render UI
    renderExams();
    renderUpcomingExams();
    
    logDebug('Exam deleted successfully');
    
    // Use notification if available
    if (typeof showPixelNotification === 'function') {
      showPixelNotification('Exam deleted successfully', 'success');
    } else {
      alert('Exam deleted successfully');
    }
  } catch (error) {
    logDebug(`Error deleting exam: ${error.message}`);
    
    // Use notification if available
    if (typeof showPixelNotification === 'function') {
      showPixelNotification(`Error deleting exam: ${error.message}`, 'error');
    } else {
      alert(`Error deleting exam: ${error.message}`);
    }
  }
}

// View exam details
export function viewExamDetails(examId) {
  logDebug(`Viewing exam details for ID: ${examId}`);
  
  // Find the exam
  const exam = exams.find(e => e.id === examId);
  if (!exam) {
    alert('Exam not found');
    return;
  }
  
  // For now, just show an alert with details
  alert(`
    Exam: ${exam.title}
    Course: ${exam.course_name || 'Unknown'}
    Date: ${formatDate(exam.date)}
    ${exam.location ? `Location: ${exam.location}` : ''}
    ${exam.duration ? `Duration: ${exam.duration} minutes` : ''}
    Status: ${exam.status}
    ${exam.grade ? `Grade: ${exam.grade}` : ''}
  `);
}

// Make functions available globally for onclick handlers
window.viewExamDetails = viewExamDetails;
window.deleteExam = deleteExam;