// StudyManager Application
document.addEventListener('DOMContentLoaded', function() {
  // Setup global variables
  const API_URL = 'http://localhost:3000/api';
  let courses = [];
  let assignments = [];
  
  // Debug functions
  function logDebug(message) {
    console.log(message);
    const log = document.getElementById('debug-log');
    if (log) {
      const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
      if (typeof message === 'object') {
        log.innerHTML += `<pre>[${timestamp}] ${JSON.stringify(message, null, 2)}</pre>`;
      } else {
        log.innerHTML += `<p>[${timestamp}] ${message}</p>`;
      }
      
      // Auto-scroll to bottom
      log.scrollTop = log.scrollHeight;
    }
  }
  
  // Set debug status
  function setDebugStatus(success, message) {
    const panel = document.getElementById('debug-panel');
    const status = document.getElementById('debug-status');
    
    if (panel && status) {
      if (success) {
        panel.classList.add('success');
        status.innerHTML = `✅ ${message}`;
      } else {
        panel.classList.remove('success');
        status.innerHTML = `❌ ${message}`;
      }
    }
  }
  
  // Test API connectivity
  async function testAPI() {
    try {
      // Test courses endpoint
      const response = await fetch(`${API_URL}/courses`);
      if (response.ok) {
        setDebugStatus(true, 'API connection successful');
        return true;
      } else {
        setDebugStatus(false, `API error: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      setDebugStatus(false, `API connection failed: ${error.message}`);
      return false;
    }
  }
  
  // Toggle debug panel
  const toggleDebug = document.getElementById('toggle-debug');
  const debugPanel = document.getElementById('debug-panel');
  
  if (toggleDebug && debugPanel) {
    toggleDebug.addEventListener('click', function(e) {
      e.preventDefault();
      if (debugPanel.style.display === 'none') {
        debugPanel.style.display = 'block';
        toggleDebug.textContent = 'Hide Debug Panel';
      } else {
        debugPanel.style.display = 'none';
        toggleDebug.textContent = 'Show Debug Panel';
      }
    });
  }
  
  // Navigation
  const pageLinks = document.querySelectorAll('nav a');
  const pages = document.querySelectorAll('.page');
  
  pageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      logDebug(`Navigating to ${pageId}`);
      
      // Hide all pages
      pages.forEach(page => page.classList.remove('active'));
      
      // Show selected page
      document.getElementById(pageId).classList.add('active');
      
      // Update active link
      pageLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
  
  // Modal controls
  const modals = document.querySelectorAll('.modal');
  const closeBtns = document.querySelectorAll('.close');
  const addCourseBtn = document.getElementById('add-course-btn');
  const addAssignmentBtn = document.getElementById('add-assignment-btn');
  
  // Open course modal
  if (addCourseBtn) {
    addCourseBtn.addEventListener('click', function() {
      logDebug('Opening course modal');
      document.getElementById('add-course-modal').style.display = 'block';
    });
  }
  
  // Open assignment modal
  if (addAssignmentBtn) {
    addAssignmentBtn.addEventListener('click', function() {
      logDebug('Opening assignment modal');
      document.getElementById('add-assignment-modal').style.display = 'block';
      populateCoursesDropdown();
    });
  }
  
  // Close modal with X
  closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      logDebug('Closing modal');
      modals.forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    modals.forEach(modal => {
      if (e.target === modal) {
        logDebug('Closing modal (clicked outside)');
        modal.style.display = 'none';
      }
    });
  });
  
  // Form handlers
  const addCourseForm = document.getElementById('add-course-form');
  const addAssignmentForm = document.getElementById('add-assignment-form');
  
  if (addCourseForm) {
    addCourseForm.addEventListener('submit', function(e) {
      e.preventDefault();
      logDebug('Course form submitted');
      addCourse();
    });
  }
  
  if (addAssignmentForm) {
    addAssignmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      logDebug('Assignment form submitted');
      addAssignment();
    });
  }
  
  // Format date
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }
  
  // Format status
  function formatStatus(status) {
    if (!status) return 'N/A';
    
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Load courses
  async function loadCourses() {
    try {
      logDebug('Loading courses...');
      const response = await fetch(`${API_URL}/courses`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      // In the loadCourses function, after fetching the data
      courses = await response.json();
      console.log("Raw courses data:", courses); // Check raw data
      console.log("Number of courses:", courses.length); // Check length
      logDebug(`Loaded ${courses.length} courses`);
      
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
  
  // Load assignments
  async function loadAssignments() {
    try {
      logDebug('Loading assignments...');
      const response = await fetch(`${API_URL}/assignments`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      assignments = await response.json();
      logDebug(`Loaded ${assignments.length} assignments`);
      
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
  
  // Render courses
  function renderCourses() {
    const courseList = document.getElementById('course-list');
    logDebug(`Course list element found: ${courseList ? 'Yes' : 'No'}`);
    if (!courseList) return;
    
    if (courses.length === 0) {
      courseList.innerHTML = '<p>No courses found. Add your first course.</p>';
      return;
    }
    
    let html = '';
    courses.forEach(course => {
      const statusClass = `status-${course.status.replace('_', '-')}`;
      
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
          </div>
        </div>
      `;
    });
    
    courseList.innerHTML = html;
    logDebug('Courses rendered');
  }
  
  // Render current courses
  function renderCurrentCourses() {
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
  
  // Render assignments
  function renderAssignments() {
    const assignmentsContainer = document.getElementById('assignments-container');
    if (!assignmentsContainer) return;
    
    if (assignments.length === 0) {
      assignmentsContainer.innerHTML = '<p>No assignments found. Add your first assignment.</p>';
      return;
    }
    
    let html = '';
    assignments.forEach(assignment => {
      const statusClass = `status-${assignment.status}`;
      
      html += `
        <div class="assignment-item">
          <div class="assignment-status ${statusClass}"></div>
          <div class="assignment-info">
            <span class="assignment-title">${assignment.title}</span>
            <span class="assignment-course">${assignment.course_name || 'Unknown Course'}</span>
          </div>
          <div class="assignment-due">Due: ${formatDate(assignment.due_date)}</div>
          <button class="btn" onclick="viewAssignmentDetails(${assignment.id})">Details</button>
        </div>
      `;
    });
    
    assignmentsContainer.innerHTML = html;
    logDebug('Assignments rendered');
  }
  
  // Render upcoming assignments
  function renderUpcomingAssignments() {
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
    
    let html = '<ul class="dashboard-list">';
    upcoming.forEach(assignment => {
      html += `
        <li>
          <span class="list-item-title">${assignment.title}</span>
          <span class="list-item-subtitle">${assignment.course_name || 'Unknown Course'} - Due: ${formatDate(assignment.due_date)}</span>
        </li>
      `;
    });
    html += '</ul>';
    
    upcomingAssignments.innerHTML = html;
    logDebug('Upcoming assignments rendered');
  }
  
  // Initialize study time chart
// Initialize study time chart
function initializeStudyTimeChart() {
  try {
    const ctx = document.getElementById('study-time-chart');
    if (!ctx) {
      logDebug('Study time chart canvas not found');
      return;
    }
    
    // Check if Chart is available
    if (typeof Chart === 'undefined') {
      logDebug('Chart.js library not loaded');
      return;
    }
    
    const ctxContext = ctx.getContext('2d');
    
    // Sample data
    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Hours Studied',
        data: [2, 3.5, 1, 4.5, 2.5, 5, 1.5],
        backgroundColor: 'rgba(52, 152, 219, 0.3)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    };
    
    new Chart(ctxContext, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Hours'
            }
          }
        }
      }
    });
    
    logDebug('Study time chart initialized');
  } catch (error) {
    logDebug(`Error initializing chart: ${error.message}`);
    // Don't let chart errors stop the rest of the app
  }
}
  
  // Populate courses dropdown
  function populateCoursesDropdown() {
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
  async function addCourse() {
    const name = document.getElementById('course-name').value;
    const code = document.getElementById('course-code').value;
    const credits = document.getElementById('course-credits').value;
    const startDate = document.getElementById('course-start').value;
    const endDate = document.getElementById('course-end').value;
    const status = document.getElementById('course-status').value;
    
    if (!name || !code || !credits || !startDate || !endDate) {
      alert('Please fill all required fields');
      return;
    }
    
    const newCourse = {
      name,
      code,
      credits: parseInt(credits),
      start_date: startDate,
      end_date: endDate,
      status
    };
    
    logDebug('Adding new course:');
    logDebug(newCourse);
    
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const course = await response.json();
      logDebug('Course added successfully:');
      logDebug(course);
      
      courses.push(course);
      renderCourses();
      renderCurrentCourses();
      
      document.getElementById('add-course-modal').style.display = 'none';
      document.getElementById('add-course-form').reset();
      
      alert('Course added successfully!');
    } catch (error) {
      logDebug(`Error adding course: ${error.message}`);
      alert(`Error adding course: ${error.message}`);
    }
  }
  
  // Add a new assignment
  async function addAssignment() {
    const title = document.getElementById('assignment-title').value;
    const description = document.getElementById('assignment-description').value;
    const courseId = document.getElementById('assignment-course').value;
    const dueDate = document.getElementById('assignment-due').value;
    const status = document.getElementById('assignment-status').value;
    
    if (!title || !courseId || !dueDate) {
      alert('Please fill all required fields');
      return;
    }
    
    const newAssignment = {
      title,
      description,
      course_id: parseInt(courseId),
      due_date: dueDate,
      status
    };
    
    logDebug('Adding new assignment:');
    logDebug(newAssignment);
    
    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAssignment)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const assignment = await response.json();
      logDebug('Assignment added successfully:');
      logDebug(assignment);
      
      // Reload assignments to get course names
      loadAssignments();
      
      document.getElementById('add-assignment-modal').style.display = 'none';
      document.getElementById('add-assignment-form').reset();
      
      alert('Assignment added successfully!');
    } catch (error) {
      logDebug(`Error adding assignment: ${error.message}`);
      alert(`Error adding assignment: ${error.message}`);
    }
  }
  
  // View course details
  window.viewCourseDetails = function(courseId) {
    logDebug(`Viewing course details for ID: ${courseId}`);
    alert(`View details for course ID: ${courseId} (Feature coming soon)`);
  };
  
  // View assignment details
  window.viewAssignmentDetails = function(assignmentId) {
    logDebug(`Viewing assignment details for ID: ${assignmentId}`);
    alert(`View details for assignment ID: ${assignmentId} (Feature coming soon)`);
  };
  
// Initialize application
async function init() {
  logDebug('Initializing application...');
  
  // Test API connection
  const apiConnected = await testAPI();
  
  if (apiConnected) {
    try {
      // Initialize chart (but don't let errors stop us)
      initializeStudyTimeChart();
    } catch (error) {
      logDebug(`Chart initialization error: ${error.message}`);
    }
    
    // Load data regardless of chart errors
    await loadCourses();
    await loadAssignments();
    logDebug('Application initialized successfully');
  } else {
    logDebug('Application initialization failed due to API connection issues');
  }
}
  
  // Start the application
  init();
});