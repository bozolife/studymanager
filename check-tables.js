// check-tables.js
const { Pool } = require('pg');

// Create connection pool with your credentials
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'studymanager',
  password: 'reni12345',
  port: 5432,
});

async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Check if tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n--- Database Tables ---');
    if (tables.rows.length === 0) {
      console.log('No tables found in the database. You need to run the schema.sql script.');
      return;
    } else {
      tables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
    // Check for courses data
    const courses = await pool.query('SELECT * FROM courses');
    console.log('\n--- Courses Data ---');
    console.log(`Found ${courses.rows.length} courses`);
    
    if (courses.rows.length > 0) {
      console.log('First course:', courses.rows[0]);
    } else {
      console.log('No courses found. You might need to insert sample data.');
    }
    
    // Check for assignments data
    try {
      const assignments = await pool.query('SELECT * FROM assignments');
      console.log('\n--- Assignments Data ---');
      console.log(`Found ${assignments.rows.length} assignments`);
      
      if (assignments.rows.length > 0) {
        console.log('First assignment:', assignments.rows[0]);
      } else {
        console.log('No assignments found. You might need to insert sample data.');
      }
    } catch (err) {
      console.log('Error querying assignments:', err.message);
    }
    
  } catch (err) {
    console.error('Error checking tables:', err);
  } finally {
    await pool.end();
  }
}

checkTables();