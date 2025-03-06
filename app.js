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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});