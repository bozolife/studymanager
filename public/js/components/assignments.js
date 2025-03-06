// assignments.js - Assignment Components
import { logDebug } from '../utils/debug.js';
import { fetchData, postData } from '../api.js';
import { formatDate, getAssignmentStatusClass } from '../utils/formatters.js';
import { closeModal } from '../ui/modal.js';
import { getCourses } from './courses.js';

// Store for assignment data
let assignments = [];

// Get all assignments
export function getAssignments() {
  return assignments;
}

// Load assignments from API
export async function loadAssignments() {
  try {
    logDebug('Loading assignments...');
    
    // Fetch assignments from API
    assignments = await fetchData('assignments');
    logDebug(`Loaded ${assignments.length} assignments`);
    
    // Render assignments in UI
    renderAssignments();
    renderUpcomingAssignments();
    return true;
  } catch (error) {
    logDebug(`Error loading assignments: ${error.message}`);
    const assignmentsContainer = document.getElementById('assignments-container');
    if (assignmentsContainer) {
      assignmentsContainer.innerHTML = '<p>Error loading assignments. Please try again.</p>';
    }
    return false;
  }
}

// Render assignments list
export function renderAssignments() {
  const assignmentsContainer = document.getElementById('assignments-container');
  if (!assignmentsContainer) return;
  
  if (assignments.length === 0) {
    assignmentsContainer.innerHTML = '<p>No assignments found. Add your first assignment.</p>';
    return;
  }
  
  // Get courses for course names
  const courses = getCourses();
  
  let html = '';
  assignments.forEach(assignment => {
    const statusClass = getAssignmentStatusClass(assignment.status);
    
    // Find course name from course_id
    let courseName = 'Unknown Course';
    if (assignment.course_name) {
      courseName = assignment.course_name;
    } else if (assignment.course_id) {
      const course = courses.find(c => c.id === assignment.course_id);
      if (course) {
        courseName = course.name;
      }
    }
    
    html += `
      <div class="assignment-item">
        <div class="assignment-status ${statusClass}"></div>
        <div class="assignment-info">
          <span class="assignment-title">${assignment.title}</span>
          <span class="assignment-course">${courseName}</span>
        </div>
        <div class="assignment-due">Due: ${formatDate(assignment.due_date)}</div>
        <div class="assignment-actions">
          <button class="btn btn-sm" onclick="viewAssignmentDetails(${assignment.id})">Details</button>
          <button class="btn btn-sm btn-danger" onclick="deleteAssignment(${assignment.id})">Delete</button>
        </div>
      </div>
    `;
  });
  
  assignmentsContainer.innerHTML = html;
  logDebug('Assignments rendered');
}

// Render upcoming assignments on dashboard
export function renderUpcomingAssignments() {
  const upcomingAssignments = document.getElementById('upcoming-assignments');
  if (!upcomingAssignments) return;
  
  if (assignments.length === 0) {
    upcomingAssignments.innerHTML = '<p>No upcoming assignments found.</p>';
    return;
  }
  
  // Filter for upcoming assignments
  const now = new Date();
  const upcoming = assignments
    .filter(assignment => new Date(assignment.due_date) > now)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);
  
  if (upcoming.length === 0) {
    upcomingAssignments.innerHTML = '<p>No upcoming assignments found.</p>';
    return;
  }
  
  // Get courses for course names
  const courses = getCourses();
  
  let html = '<ul class="dashboard-list">';
  upcoming.forEach(assignment => {
    // Find course name from course_id
    let courseName = 'Unknown Course';
    if (assignment.course_name) {
      courseName = assignment.course_name;
    } else if (assignment.course_id) {
      const course = courses.find(c => c.id === assignment.course_id);
      if (course) {
        courseName = course.name;
      }
    }
    
    html += `
      <li>
        <span class="list-item-title">${assignment.title}</span>
        <span class="list-item-subtitle">${courseName} - Due: ${formatDate(assignment.due_date)}</span>
      </li>
    `;
  });
  html += '</ul>';
  
  upcomingAssignments.innerHTML = html;
  logDebug('Upcoming assignments rendered');
}

// Add a new assignment
export async function addAssignment(assignmentData) {
  logDebug('Adding new assignment:');
  logDebug(assignmentData);
  
  try {
    // Post assignment to API
    const assignment = await postData('assignments', assignmentData);
    logDebug('Assignment added successfully:');
    logDebug(assignment);
    
    // Reload assignments to get updated data with course names
    await loadAssignments();
    
    // Close modal and reset form
    closeModal('add-assignment-modal');
    document.getElementById('add-assignment-form').reset();
    
    alert('Assignment added successfully!');
  } catch (error) {
    logDebug(`Error adding assignment: ${error.message}`);
    alert(`Error adding assignment: ${error.message}`);
  }
}

// Delete an assignment
export async function deleteAssignment(assignmentId) {
  if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
    return;
  }
  
  logDebug(`Deleting assignment ID: ${assignmentId}`);
  
  try {
    // Delete from API
    const response = await fetch(`/api/assignments/${assignmentId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete assignment');
    }
    
    // Remove from local array
    assignments = assignments.filter(assignment => assignment.id !== assignmentId);
    
    // Re-render UI
    renderAssignments();
    renderUpcomingAssignments();
    
    logDebug('Assignment deleted successfully');
    alert('Assignment deleted successfully');
  } catch (error) {
    logDebug(`Error deleting assignment: ${error.message}`);
    alert(`Error deleting assignment: ${error.message}`);
  }
}

// View assignment details
export function viewAssignmentDetails(assignmentId) {
  logDebug(`Viewing assignment details for ID: ${assignmentId}`);
  alert(`View details for assignment ID: ${assignmentId} (Feature coming soon)`);
}

// Make functions available globally for onclick handlers
window.viewAssignmentDetails = viewAssignmentDetails;
window.deleteAssignment = deleteAssignment;