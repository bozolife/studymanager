// courses.js - Course Components
import { logDebug } from '../utils/debug.js';
import { fetchData, postData } from '../api.js';
import { formatDate, formatStatus, getCourseStatusClass } from '../utils/formatters.js';
import { closeModal } from '../ui/modal.js';

// Store for course data
let courses = [];

// Get all courses
export function getCourses() {
  return courses;
}

// Load courses from API
export async function loadCourses() {
  try {
    logDebug('Loading courses...');
    
    // Fetch courses from API
    courses = await fetchData('courses');
    logDebug(`Loaded ${courses.length} courses`);
    
    // Render courses in UI
    renderCourses();
    renderCurrentCourses();
    return true;
  } catch (error) {
    logDebug(`Error loading courses: ${error.message}`);
    const courseList = document.getElementById('course-list');
    if (courseList) {
      courseList.innerHTML = '<p>Error loading courses. Please try again.</p>';
    }
    return false;
  }
}

// Render course list
export function renderCourses() {
  const courseList = document.getElementById('course-list');
  logDebug(`Course list element found: ${courseList ? 'Yes' : 'No'}`);
  if (!courseList) return;
  
  if (courses.length === 0) {
    courseList.innerHTML = '<p>No courses found. Add your first course.</p>';
    return;
  }
  
  let html = '';
  courses.forEach(course => {
    const statusClass = getCourseStatusClass(course.status);
    
    html += `
      <div class="course-card">
        <h3>${course.name}</h3>
        <div class="course-code">${course.code}</div>
        
        <div class="course-details">
          <div>
            <span>Credits</span>
            <span>${course.credits}</span>
          </div>
          <div>
            <span>Start Date</span>
            <span>${formatDate(course.start_date)}</span>
          </div>
          <div>
            <span>End Date</span>
            <span>${formatDate(course.end_date)}</span>
          </div>
          <div>
            <span>Status</span>
            <span class="course-status ${statusClass}">${formatStatus(course.status)}</span>
          </div>
        </div>
        
        <div class="course-actions">
          <button class="btn" onclick="viewCourseDetails(${course.id})">View Details</button>
          <button class="btn btn-danger" onclick="deleteCourse(${course.id})">Delete</button>
        </div>
      </div>
    `;
  });
  
  courseList.innerHTML = html;
  logDebug('Courses rendered');
}

// Render current courses on dashboard
export function renderCurrentCourses() {
  const currentCourses = document.getElementById('current-courses');
  if (!currentCourses) return;
  
  if (courses.length === 0) {
    currentCourses.innerHTML = '<p>No current courses found.</p>';
    return;
  }
  
  // Filter for in-progress courses
  const inProgressCourses = courses.filter(course => course.status === 'in_progress');
  
  if (inProgressCourses.length === 0) {
    currentCourses.innerHTML = '<p>No courses currently in progress.</p>';
    return;
  }
  
  let html = '<ul class="dashboard-list">';
  inProgressCourses.forEach(course => {
    html += `
      <li>
        <span class="list-item-title">${course.name}</span>
        <span class="list-item-subtitle">${course.code} - ${course.credits} credits</span>
      </li>
    `;
  });
  html += '</ul>';
  
  currentCourses.innerHTML = html;
  logDebug('Current courses rendered');
}

// Populate courses dropdown for assignment form
export function populateCoursesDropdown() {
  const courseSelect = document.getElementById('assignment-course');
  if (!courseSelect) return;
  
  let options = '<option value="">Select a course</option>';
  courses.forEach(course => {
    options += `<option value="${course.id}">${course.name} (${course.code})</option>`;
  });
  
  courseSelect.innerHTML = options;
  logDebug('Courses dropdown populated');
}

// Add a new course
export async function addCourse(courseData) {
  logDebug('Adding new course:');
  logDebug(courseData);
  
  try {
    // Post course to API
    const course = await postData('courses', courseData);
    logDebug('Course added successfully:');
    logDebug(course);
    
    // Add to local courses array
    courses.push(course);
    
    // Update UI
    renderCourses();
    renderCurrentCourses();
    
    // Close modal and reset form
    closeModal('add-course-modal');
    document.getElementById('add-course-form').reset();
    
    alert('Course added successfully!');
  } catch (error) {
    logDebug(`Error adding course: ${error.message}`);
    alert(`Error adding course: ${error.message}`);
  }
}

// Delete a course
export async function deleteCourse(courseId) {
  if (!confirm('Are you sure you want to delete this course? This will also delete all associated assignments, exams, and materials. This action cannot be undone.')) {
    return;
  }
  
  logDebug(`Deleting course ID: ${courseId}`);
  
  try {
    // Delete from API
    const response = await fetch(`/api/courses/${courseId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete course');
    }
    
    // Remove from local array
    courses = courses.filter(course => course.id !== courseId);
    
    // Re-render UI
    renderCourses();
    renderCurrentCourses();
    
    logDebug('Course deleted successfully');
    alert('Course deleted successfully');
  } catch (error) {
    logDebug(`Error deleting course: ${error.message}`);
    alert(`Error deleting course: ${error.message}`);
  }
}

// View course details
export function viewCourseDetails(courseId) {
  logDebug(`Viewing course details for ID: ${courseId}`);
  alert(`View details for course ID: ${courseId} (Feature coming soon)`);
}

// Make viewCourseDetails available globally for onclick handlers
window.viewCourseDetails = viewCourseDetails;

// Make deleteCourse available globally for onclick handlers
window.deleteCourse = deleteCourse;

// Make populateCoursesDropdown available globally
window.populateCoursesDropdown = populateCoursesDropdown;