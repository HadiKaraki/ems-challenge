-- -- This file contains the SQL schema, it drops all tables and recreates them

-- DELETE FROM employees;
-- DELETE FROM timesheets;
-- VACUUM;

-- DROP TABLE IF EXISTS employees;
-- DROP TABLE IF EXISTS timesheets;

-- -- To add a field to a table do
-- -- CREATE TABLE table_name (
-- --     id INTEGER PRIMARY KEY AUTOINCREMENT,
-- --     nullable_field TEXT,
-- --     non_nullable_field TEXT NOT NULL,
-- --     numeric_field INTEGER,
-- --     unique_field TEXT UNIQUE,
-- --     unique_non_nullable_field TEXT NOT NULL UNIQUE,
-- --     date_field DATE,
-- --     datetime_field DATETIME
-- -- );

-- Create employees table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_nb TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL NOT NULL CHECK(salary > 0),
    start_date DATE NOT NULL,
    end_date DATE NULL
);

-- Create timesheets table
CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    employee_id INTEGER NOT NULL,
    summary_work TEXT NULL
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);