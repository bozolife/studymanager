// Simple debug loader to test script loading and variable scope
console.log('Debug loader initialized');

// Create a global object for our application
window.StudyManager = {
  API_URL: 'http://localhost:3000/api',
  courses: [],
  assignments: [],
  
  // Debug function to check API connectivity
  testAPI: async function() {
    try {
      console.log('Testing API connection...');
      
      // Test courses endpoint
      const coursesResponse = await fetch(`${this.API_URL}/courses`);
      if (!coursesResponse.ok) {
        throw new Error(`Courses API error: ${coursesResponse.status}`);
      }
      const coursesData = await coursesResponse.json();
      console.log('Courses API response:', coursesData);
      
      // Test assignments endpoint
      const assignmentsResponse = await fetch(`${this.API_URL}/assignments`);
      if (!assignmentsResponse.ok) {
        throw new Error(`Assignments API error: ${assignmentsResponse.status}`);
      }
      const assignmentsData = await assignmentsResponse.json();
      console.log('Assignments API response:', assignmentsData);
      
      console.log('API connectivity test passed');
      return true;
    } catch (error) {
      console.error('API test failed:', error);
      return false;
    }
  }
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Document loaded, testing API connection...');
  
  // Add a visible debug message
  const main = document.querySelector('main');
  if (main) {
    const debugElem = document.createElement('div');
    debugElem.style.backgroundColor = '#f8d7da';
    debugElem.style.color = '#721c24';
    debugElem.style.padding = '10px';
    debugElem.style.margin = '10px 0';
    debugElem.style.borderRadius = '4px';
    debugElem.id = 'debug-message';
    debugElem.innerHTML = '<h3>Debug Mode</h3><p>Testing API connectivity...</p>';
    main.prepend(debugElem);
  }
  
  // Test API connectivity
  const apiWorking = await window.StudyManager.testAPI();
  
  // Update debug message
  const debugMsg = document.getElementById('debug-message');
  if (debugMsg) {
    if (apiWorking) {
      debugMsg.style.backgroundColor = '#d4edda';
      debugMsg.style.color = '#155724';
      debugMsg.innerHTML = '<h3>Debug Mode</h3><p>✅ API connection successful</p>';
    } else {
      debugMsg.innerHTML += '<p>❌ API connection failed. Check console for details.</p>';
    }
  }
});