// Data loading and manipulation functions

// Load courses from API
async function loadCourses() {
    try {
      console.log('Fetching courses from API...');
      const response = await fetch(`${API_URL}/courses`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      courses = await response.json();
      console.log('Courses loaded successfully:', courses);
      
      renderCourses();
      renderCurrentCourses();
    } catch (error) {
      console.error('Error loading courses:', error);
      const courseList = document.getElementById('course-list');
      if (courseList) {
        courseList.innerHTML = '<p>Error loading courses. Please try again.</p>';
      }
    }
  }
  
  // Load assignments from API
  async function loadAssignments() {
    try {
      console.log('Fetching assignments from API...');
      const response = await fetch(`${API_URL}/assignments`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      assignments = await response.json();
      console.log('Assignments loaded successfully:', assignments);
      
      renderAssignments();
      renderUpcomingAssignments();
    } catch (error) {
      console.error('Error loading assignments:', error);
      const assignmentsContainer = document.getElementById('assignments-container');
      if (assignmentsContainer) {
        assignmentsContainer.innerHTML = '<p>Error loading assignments. Please try again.</p>';
      }
    }
  }
  
  // Render courses to the courses page
  function renderCourses() {
    const courseList = document.getElementById('course-list');
    if (!courseList) return;
    
    if (courses.length === 0) {
      courseList.innerHTML = '<p>No courses found. Add your first course to get started.</p>';
      return;
    }
    
    let coursesHTML = '';
    
    courses.forEach(course => {
      const statusClass = `status-${course.status.replace('_', '-')}`;
      
      coursesHTML += `
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
    
    courseList.innerHTML = coursesHTML;
  }
  
  // Render current courses on dashboard
  function renderCurrentCourses() {
    const currentCourses = document.getElementById('current-courses');
    if (!currentCourses) return;
    
    if (courses.length === 0) {
      currentCourses.innerHTML = '<p>No current courses found.</p>';
      return;
    }
    
    // Filter for in-progress courses only
    const inProgressCourses = courses.filter(course => course.status === 'in_progress');
    
    if (inProgressCourses.length === 0) {
      currentCourses.innerHTML = '<p>No courses currently in progress.</p>';
      return;
    }
    
    let coursesHTML = '<ul class="dashboard-list">';
    
    inProgressCourses.forEach(course => {
      coursesHTML += `
        <li>
          <span class="list-item-title">${course.name}</span>
          <span class="list-item-subtitle">${course.code} - ${course.credits} credits</span>
        </li>
      `;
    });
    
    coursesHTML += '</ul>';
    currentCourses.innerHTML = coursesHTML;
  }
  
  // Render assignments to the assignments page
  function renderAssignments() {
    const assignmentsContainer = document.getElementById('assignments-container');
    if (!assignmentsContainer) return;
    
    if (assignments.length === 0) {
      assignmentsContainer.innerHTML = '<p>No assignments found. Add your first assignment to get started.</p>';
      return;
    }
    
    let assignmentsHTML = '';
    
    assignments.forEach(assignment => {
      const statusClass = `status-${assignment.status}`;
      
      assignmentsHTML += `
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
    
    assignmentsContainer.innerHTML = assignmentsHTML;
  }
  
  // Render upcoming assignments on dashboard
  function renderUpcomingAssignments() {
    const upcomingAssignments = document.getElementById('upcoming-assignments');
    if (!upcomingAssignments) return;
    
    if (assignments.length === 0) {
      upcomingAssignments.innerHTML = '<p>No upcoming assignments found.</p>';
      return;
    }
    
    // Filter for upcoming assignments and sort by due date
    const now = new Date();
    const upcoming = assignments
      .filter(assignment => new Date(assignment.due_date) > now)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 5); // Get only the 5 nearest upcoming assignments
    
    if (upcoming.length === 0) {
      upcomingAssignments.innerHTML = '<p>No upcoming assignments found.</p>';
      return;
    }
    
    let assignmentsHTML = '<ul class="dashboard-list">';
    
    upcoming.forEach(assignment => {
      assignmentsHTML += `
        <li>
          <span class="list-item-title">${assignment.title}</span>
          <span class="list-item-subtitle">${assignment.course_name || 'Unknown Course'} - Due: ${formatDate(assignment.due_date)}</span>
        </li>
      `;
    });
    
    assignmentsHTML += '</ul>';
    upcomingAssignments.innerHTML = assignmentsHTML;
  }
  
  // Populate courses dropdown for assignment form
  function populateCoursesDropdown() {
    const assignmentsCourse = document.getElementById('assignment-course');
    if (!assignmentsCourse) return;
    
    console.log('Populating courses dropdown');
    
    let options = '<option value="">Select a course</option>';
    
    courses.forEach(course => {
      options += `<option value="${course.id}">${course.name} (${course.code})</option>`;
    });
    
    assignmentsCourse.innerHTML = options;
    console.log(`Dropdown populated with ${courses.length} courses`);
  }