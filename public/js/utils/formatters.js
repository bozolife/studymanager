// formatters.js - Data Formatting Utilities

// Format date
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }
  
  // Format status
  export function formatStatus(status) {
    if (!status) return 'N/A';
    
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Get CSS class for course status
  export function getCourseStatusClass(status) {
    return `status-${status.replace('_', '-')}`;
  }
  
  // Get CSS class for assignment status
  export function getAssignmentStatusClass(status) {
    return `status-${status}`;
  }