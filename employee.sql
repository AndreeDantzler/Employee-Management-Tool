DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE department (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(10,4) NOT NULL,
  department_id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER NULL,
  PRIMARY KEY (id)
);

SELECT * FROM department;
SELECT * FROM role; 
SELECT * FROM employee;

INSERT INTO department (name)
VALUES ("Legal"),
      ("Sales"),
      ("Accounting");

SELECT * FROM department;      

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 100000, 1),
        ("Sales Assistant",70000, 2),
        ("Accountant", 80000, 3);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andy", "Donelly", 2, 3),
        ("Janet", "Monty", 1, 3),
        ("Peter", "Pesci", 3, 2);

SELECT * FROM employee;


