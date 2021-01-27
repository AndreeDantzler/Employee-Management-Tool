const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeesDB",
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add Departments",
        "Add Roles",
        "Add Employees",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Roles",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add Departments":
          addDepartments();
          break;

        case "Add Roles":
          addRoles();
          break;

        case "Add Employees":
          addEmployees();
          break;

        case "View Departments":
          viewDepartments();
          break;

        case "View Roles":
          viewRolesWithDepartments();
          break;

        case "View Employees":
          viewEmployeesWithRoles();
          break;

        case "Update Roles":
          updateRoles();
          break;
      }
    });
}

function addDepartments() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the name of the department you would like to add?",
    })
    .then(function (answer) {
      let query = "INSERT INTO department SET ?";
      connection.query(query, { name: answer.department }, function (err, res) {
        if (err) throw err;
        console.table(res);
        viewDepartments();
        runSearch();
      });
    });
}

function addRoles() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the role you would like to add?",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter salary: ",
      },
      {
        name: "department_id",
        type: "input",
        message: "Enter department id role belongs to: ",
      },
    ])
    .then(function (answer) {
      let query = "INSERT INTO role SET ?";
      connection.query(
        query,
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        function (err, res) {
          if (err) throw err;
          console.table(res);
          viewRolesWithDepartments();
          runSearch();
        }
      );
    });
}

function addEmployees() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message:
          "What is the first name of the employee you would like to add?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the last name of the employee you would like to add?",
      },
      {
        name: "role",
        type: "input",
        message: "Enter Role Id: ",
      },
      {
        name: "manager",
        type: "input",
        message: "Enter manager Id : ",
      },
    ])
    .then(function (answer) {
      let query = "INSERT INTO employee SET ?";
      connection.query(
        query,
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.role,
          manager_id: answer.manager,
        },
        function (err, res) {
          if (err) throw err;
          console.table(res);
          viewEmployeesWithRoles();
          runSearch();
        }
      );
    });
}

function viewDepartments() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function viewRolesWithDepartments() {
  let query = "SELECT role.id, role.title, role.salary, department.name";
query += " FROM role JOIN department ON role.department_id = department.id"
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function viewEmployeesWithRoles() {
let query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, role.department_id";
query += " FROM employee JOIN role ON employee.role_id = role.id"
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function updateRoles() {
let query = "SELECT * FROM role";
connection.query (query, function (err, res) {
    if (err) throw err;
    console.table(res);
    inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is THE ID of the role to change?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the new salary?"

      },
    ])
    .then(function (answer) {
      let query = "UPDATE role SET? WHERE?";
      connection.query(
        query,
        [{
          salary: answer.salary,
        }, 
        {
          
        id : answer.id
        }],

        function (err, res) {
          if (err) throw err;
          viewRolesWithDepartments();
          runSearch();

        }
      );
    });
    });
}



