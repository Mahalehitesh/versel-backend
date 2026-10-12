-- V2: Create Departure History Table for Students and Teachers
CREATE TABLE departure_history (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('STUDENT', 'TEACHER')),
    original_id BIGINT,
    identifier VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(50),
    department_or_grade VARCHAR(100),
    gender VARCHAR(20),
    date_of_birth DATE,
    enrollment_or_joining_date DATE,
    departure_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    guardian_info VARCHAR(255),
    address TEXT,
    notes TEXT,
    previous_classrooms TEXT,
    deleted_by VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_departure_history_type ON departure_history(entity_type);
CREATE INDEX idx_departure_history_identifier ON departure_history(identifier);
CREATE INDEX idx_departure_history_departure_date ON departure_history(departure_date);

-- Seed initial historical data for demonstration
INSERT INTO departure_history (
    entity_type, original_id, identifier, full_name, email, phone, department_or_grade, gender, 
    date_of_birth, enrollment_or_joining_date, departure_date, guardian_info, address, notes, previous_classrooms, deleted_by
) VALUES 
(
    'STUDENT', 991, 'STU-9901', 'Lucas Vance', 'lucas.v@school.com', '+1-555-0811', 'Grade 12-A', 'Male',
    '2006-05-14', '2022-09-01', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Arthur Vance (+1-555-0810)', '452 Elm Street, Springfield',
    'Graduated and relocated out of state', 'Advanced Calculus (Mathematics), Physics Honors (Science)', 'admin'
),
(
    'STUDENT', 992, 'STU-9902', 'Elena Rostova', 'elena.r@school.com', '+1-555-0822', 'Grade 10-B', 'Female',
    '2008-11-20', '2023-09-01', CURRENT_TIMESTAMP - INTERVAL '30 days', 'Irina Rostova (+1-555-0820)', '12 Ocean View Blvd, Springfield',
    'Transferred to international boarding academy', 'World History (History), Chemistry Lab (Science)', 'admin'
),
(
    'TEACHER', 881, 'EMP-8801', 'Dr. Marcus Reed', 'marcus.reed@school.com', '+1-555-0711', 'Physical Sciences', 'N/A',
    NULL, '2018-08-15', CURRENT_TIMESTAMP - INTERVAL '45 days', 'N/A', 'N/A',
    'Retired after 8 years of distinguished service', 'Physics Lab (Science), Chemistry 101 (Science)', 'admin'
);
