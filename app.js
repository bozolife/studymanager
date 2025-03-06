// app.js - Main Express application file
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = 3000;

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'studymanager',
  password: 'reni12345', // Updated with your actual password
  port: 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    console.error('Make sure PostgreSQL is running and credentials are correct');
  } else {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY start_date');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new course
app.post('/api/courses', async (req, res) => {
  const { name, code, credits, start_date, end_date, status } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO courses (name, code, credits, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, code, credits, start_date, end_date, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding course:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all assignments
app.get('/api/assignments', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT a.*, c.name as course_name FROM assignments a JOIN courses c ON a.course_id = c.id ORDER BY due_date'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new assignment
app.post('/api/assignments', async (req, res) => {
  const { title, description, due_date, course_id, status } = req.body;
  
  console.log('Received assignment data:', req.body);
  
  // Validate input
  if (!title || !due_date || !course_id) {
    console.error('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields: title, due_date, and course_id are required' });
  }
  
  try {
    console.log('Attempting to insert assignment into database...');
    const result = await pool.query(
      'INSERT INTO assignments (title, description, due_date, course_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, due_date, course_id, status]
    );
    console.log('Assignment added successfully:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding assignment:', err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

// EXAM ROUTES
// Get all exams
app.get('/api/exams', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT e.*, c.name as course_name FROM exams e JOIN courses c ON e.course_id = c.id ORDER BY date'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new exam
app.post('/api/exams', async (req, res) => {
  const { title, course_id, exam_date, duration, location, status, grade } = req.body;
  
  // Validate input
  if (!title || !course_id || !exam_date) {
    return res.status(400).json({ error: 'Missing required fields: title, course_id, and exam_date are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO exams (title, course_id, date, duration, location, status, score) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, course_id, exam_date, duration, location, status || 'scheduled', grade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding exam:', err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});



// Update an exam
app.put('/api/exams/:id', async (req, res) => {
  const { id } = req.params;
  const { title, course_id, exam_date, duration, location, status, grade } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE exams SET title = $1, course_id = $2, exam_date = $3, duration = $4, location = $5, status = $6, grade = $7 WHERE id = $8 RETURNING *',
      [title, course_id, exam_date, duration, location, status, grade, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating exam:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an exam
app.delete('/api/exams/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM exams WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json({ message: 'Exam deleted successfully', exam: result.rows[0] });
  } catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// MATERIALS ROUTES
// Get all materials
app.get('/api/materials', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT m.*, c.name as course_name FROM materials m JOIN courses c ON m.course_id = c.id ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get materials by course ID
app.get('/api/courses/:courseId/materials', async (req, res) => {
  const { courseId } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM materials WHERE course_id = $1 ORDER BY created_at DESC',
      [courseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching materials for course:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new material
app.post('/api/materials', async (req, res) => {
  const { title, description, course_id, type, url, is_required } = req.body;
  
  // Validate input
  if (!title || !course_id || !type) {
    return res.status(400).json({ error: 'Missing required fields: title, course_id, and type are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO materials (title, description, course_id, type, url, is_required) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, course_id, type, url, is_required || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding material:', err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

// Update a material
app.put('/api/materials/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, course_id, type, url, is_required } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE materials SET title = $1, description = $2, course_id = $3, type = $4, url = $5, is_required = $6 WHERE id = $7 RETURNING *',
      [title, description, course_id, type, url, is_required, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating material:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a material
app.delete('/api/materials/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM materials WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json({ message: 'Material deleted successfully', material: result.rows[0] });
  } catch (err) {
    console.error('Error deleting material:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE ROUTES FOR EXISTING ENTITIES
// Delete a course
app.delete('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // First check if course exists
    const checkResult = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Delete the course (cascade will handle related records)
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
    
    res.json({ message: 'Course deleted successfully', course: result.rows[0] });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an assignment
app.delete('/api/assignments/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM assignments WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json({ message: 'Assignment deleted successfully', assignment: result.rows[0] });
  } catch (err) {
    console.error('Error deleting assignment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});