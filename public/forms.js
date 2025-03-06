// Form submission handlers

// Add a new course
async function addCourse() {
    const name = document.getElementById('course-name').value;
    const code = document.getElementById('course-code').value;
    const credits = document.getElementById('course-credits').value;
    const startDate = document.getElementById('course-start').value;
    const endDate = document.getElementById('course-end').value;
    const status = document.getElementById('course-status').value;
    
    const newCourse = {
      name,
      code,
      credits: parseInt(credits),
      start_date: startDate,
      end_date: endDate,
      status
    };
    
    console.log('Adding new course:', newCourse);
    
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
      });
      
      console.log(`API response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const course = await response.json();
        console.log('Course added successfully:', course);
        
        courses.push(course);
        renderCourses();
        renderCurrentCourses();
        document.getElementById('add-course-modal').style.display = 'none';
        document.getElementById('add-course-form').reset();
        alert('Course added successfully!');
      } else {
        const errorText = await response.text();
        console.error(`Failed to add course: ${errorText}`);
        alert(`Failed to add course: ${errorText}`);
      }
    } catch (error) {
      console.error(`Error adding course: ${error.message}`);
      alert(`Error adding course: ${error.message}`);
    }
  }
  
  // Add a new assignment
  async function addAssignment() {
    // Get input values
    const title = document.getElementById('assignment-title').value;
    const description = document.getElementById('assignment-description').value;
    const courseId = document.getElementById('assignment-course').value;
    const dueDate = document.getElementById('assignment-due').value;
    const status = document.getElementById('assignment-status').value;
    
    console.log('Form values:', { title, description, courseId, dueDate, status });
    
    // Validate input
    if (!title) {
      alert('Please enter a title for the assignment');
      return;
    }
    
    if (!courseId) {
      alert('Please select a course for the assignment');
      return;
    }
    
    if (!dueDate) {
      alert('Please select a due date for the assignment');
      return;
    }
    
    // Create assignment object
    const newAssignment = {
      title,
      description,
      course_id: parseInt(courseId),
      due_date: dueDate,
      status
    };
    
    console.log('Sending new assignment to API:', newAssignment);
    
    try {
      // Send API request
      const response = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAssignment)
      });
      
      console.log(`API response status: ${response.status} ${response.statusText}`);
      
      // Get response text
      const responseText = await response.text();
      console.log('API response text:', responseText);
      
      // Try to parse as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Response parsed as JSON:', responseData);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
      }
      
      // Handle successful response
      if (response.ok) {
        console.log('Assignment added successfully!');
        
        // Add to local data if JSON was parsed
        if (responseData) {
          assignments.push(responseData);
        }
        
        // Reload assignments to get course names
        loadAssignments();
        
        // Close modal and reset form
        document.getElementById('add-assignment-modal').style.display = 'none';
        document.getElementById('add-assignment-form').reset();
        
        // Show success message
        alert('Assignment added successfully!');
      } else {
        // Handle error response
        console.error('Failed to add assignment:', responseText);
        alert(`Failed to add assignment: ${responseData?.error || response.statusText}`);
      }
    } catch (error) {
      // Handle network error
      console.error('Error adding assignment:', error);
      alert(`Error adding assignment: ${error.message}`);
    }
  }