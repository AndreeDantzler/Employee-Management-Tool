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
        "View Employees",
        "View Departments",
        "View Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Employees":
          viewEmployees();
          break;

        case "View Departments":
          viewDepartments();
          break;

        case "View Roles":
          viewRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;
      }
    });
}

function addDepartment() {
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
        console.log(`Department ${answer.department} added!`);
        runSearch();
      });
    });
}

function addRole() {
  let query = "SELECT id, name FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const choicesDepartment = [];
    res.forEach(function (choiceD) {
      choicesDepartment.push({
        name: choiceD.name,
        value: choiceD.id,
      });
    });
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
          message: "Enter salary:",
        },
        {
          name: "department",
          type: "list",
          message: "Choose the department:",
          choices: choicesDepartment,
        },
      ])
      .then(function (answer) {
        let query = "INSERT INTO role SET ?";
        connection.query(
          query,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department,
          },
          function (err, res) {
            if (err) throw err;
            console.log(
              `Role ${answer.title} with salary ${answer.salary} added!`
            );
            runSearch();
          }
        );
      });
  });
}

function addEmployee() {
  let query = "SELECT id, title FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const choicesRole = [];
    res.forEach(function (choice) {
      choicesRole.push({
        name: choice.title,
        value: choice.id,
      });
    });
    let query = "SELECT first_name, last_name, id FROM employee";
    connection.query(query, function (err, res) {
      if (err) throw err;
      const choicesManagerId = [];
      res.forEach(function (row) {
        choicesManagerId.push({
          name: `${row.first_name} ${row.last_name}`,
          value: row.id,
        });
      });
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
          message:
            "What is the last name of the employee you would like to add?",
        },
        {
          name: "role",
          type: "list",
          message: "Choose the employee's role:",
          choices: choicesRole,
        },
        {
          name: "manager",
          type: "list",
          message: "Who is the manager of the employee?",
          choices: choicesManagerId,
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
            console.log(
              `Employee ${answer.firstName} ${answer.lastName} has been added!`
            );
            runSearch();
          }
          );
        });
      });
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

function viewRoles() {
  let query = "SELECT role.id, role.title, role.salary, department.name";
  query += " FROM role JOIN department ON role.department_id = department.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function viewEmployees() {
  let query =
    "SELECT e.id, e.first_name, e.last_name, role.title, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager, department.name AS department";
  query += " FROM employee e LEFT JOIN employee m ON e.manager_id = m.id";
  query += " JOIN role ON e.role_id = role.id";
  query += " JOIN department ON role.department_id = department.id"
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function updateEmployeeRole() {
  let query = "SELECT id, first_name, last_name FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const choicesEmployees = [];
    console.log(res);
    res.forEach(function (record) {
      choicesEmployees.push({
        name: `${record.first_name} ${record.last_name}`,
        value: record.id,
      });
    });
    let query = "SELECT id, title FROM role";
    connection.query(query, function (err, res) {
      if (err) throw err;
      const choicesRolesId = [];
      console.log(res);
      res.forEach(function (row) {
        choicesRolesId.push({
          name: row.title,
          value: row.id,
        });
      });
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message:
              "What is the employee whose role you would like to change?",
            choices: choicesEmployees,
          },
          {
            name: "role",
            type: "list",
            message: "What is the employee's new role?",
            choices: choicesRolesId,
          },
        ])
        .then(function (answer) {
          let query = "UPDATE employee SET? WHERE?";
          connection.query(
            query,
            [
              {
                role_id: answer.role,
              },
              {
                id: answer.employee,
              },
            ],
            function (err, res) {
              if (err) throw err;
              console.log(`Employee's new role is updated!`);
              runSearch();
            }
          );
        });
    });
  });
}
