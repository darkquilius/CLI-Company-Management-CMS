DROP DATABASE IF EXISTS company_db;

CREATE database company_db;

USE company_db;

CREATE TABLE department(
id INT AUTO_INCREMENT,
name VARCHAR(30),
PRIMARY KEY (id)
);

CREATE TABLE role(
id INT AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL NOT NULL,
department_id INT NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE employee(
id INT AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Information Technology"), ("Human Resources"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Technician", 50000, 1), ("Sales Rep", 35000, 1), ("Manager", 60000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andrew", "Reeves", 1, 1), ("Samantha", "Medile", 2, 1), ("Peep", "Reeves", 3, 1);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

DELETE FROM department
WHERE id>3;

DELETE FROM role
WHERE id>3;

DELETE FROM employee
WHERE id>3;