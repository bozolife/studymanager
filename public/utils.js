// Utility functions

// Format date to readable format
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }
  
  // Format status from snake_case to Title Case
  function formatStatus(status) {
    if (!status) return 'N/A';
    
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }