-- Connect to postgres and create the database
-- Run this from psql or your database management tool:
-- CREATE DATABASE studymanager;
-- \c studymanager

-- Courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  credits INTEGER,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'planned', -- planned, in_progress, completed, failed
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assignments table
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, submitted, graded
  score DECIMAL(5,2),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study sessions table
CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration INTEGER, -- in minutes
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study materials table
CREATE TABLE study_materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  type VARCHAR(50), -- book, pdf, video, website, etc.
  url VARCHAR(255),
  file_path VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exams table
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date TIMESTAMP,
  location VARCHAR(255),
  duration INTEGER, -- in minutes
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, passed, failed
  score DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO courses (name, code, credits, start_date, end_date, status)
VALUES 
  ('Introduction to Business Informatics', 'WI101', 5, '2025-04-01', '2025-07-31', 'planned'),
  ('Programming Fundamentals', 'WI102', 6, '2025-04-01', '2025-07-31', 'planned'),
  ('Database Systems', 'WI103', 6, '2025-04-01', '2025-07-31', 'planned');

INSERT INTO assignments (title, description, due_date, course_id, status)
VALUES 
  ('Business Process Modeling', 'Create a BPMN diagram for an e-commerce order process', '2025-05-15', 1, 'pending'),
  ('Python Programming Exercise', 'Implement a simple inventory management system', '2025-05-20', 2, 'pending'),
  ('Database Design Project', 'Design a normalized database for a university management system', '2025-06-01', 3, 'pending');