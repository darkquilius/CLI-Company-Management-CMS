var mysql = require("mysql");
var inquirer = require("inquirer");
const consoleTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Password",
    database: "company_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start()
});

function start() {
    inquirer.prompt({
        name: "start",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Employees",
            "View Roles",
            "View Departments",
            "Add Employees",
            "Add Roles",
            "Add Departments",
            "Update an Employee",
            "End"
        ]
    }).then(function(answers) {
        if (answers.start === "View Employees") {
            showEmployee()
        } else if (answers.start === "View Roles") {
            showRole()
        } else if (answers.start === "View Departments") {
            showDepartment()
        } else if (answers.start === "Add Departments") {
            addDepartment()
        } else if (answers.start === "Add Roles") {
            addRole()
        } else if (answers.start === "Add Employees") {
            addEmployee()
        } else if (answers.start === "Update an Employee") {
            updateEmployee()
        } else {
            connection.end()
        }
    })
}

function showDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.table(res)
        start()
    })
}

function addDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What is the department's name?"
    }).then(function(answers) {
        connection.query("INSERT INTO department SET ?", { name: answers.department }, function(err) {
            if (err) throw err;
            console.log("Department added"),
                start()
        })
    })
}

function showRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.table(res)
        start()
    })
}

function addRole() {
    inquirer.prompt([{
            name: "title",
            type: "input",
            message: "What is the role's title?"
        }, {
            name: "salary",
            type: "input",
            message: "What is the role's salary?"
        }, {
            name: "department_id",
            type: "input",
            message: "What is the role's department id?"
        }])
        .then(function(answers) {
            connection.query("INSERT INTO role SET ?", [{
                title: answers.title,
                salary: answers.salary,
                department_id: answers.department_id
            }], function(err) {
                if (err) throw err;
                console.log("Role added"),
                    start()
            })
        })
}

function showEmployee() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        console.table(res)
        start()
    })
}

function addEmployee() {
    inquirer.prompt([{
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        }, {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
        }, {
            name: "role_id",
            type: "input",
            message: "What is the employee's role id?"
        }, {
            name: "manager_id",
            type: "input",
            message: "What is the employee's manager id?"
        }])
        .then(function(answers) {
            connection.query("INSERT INTO employee SET ?", [{
                first_name: answers.first_name,
                last_name: answers.last_name,
                role_id: answers.role_id,
                manager_id: answers.manager_id
            }], function(err) {
                if (err) throw err;
                console.log("Employee added"),
                    start()
            })
        })
}

function updateEmployee() {
    inquirer.prompt([{
            name: "id",
            type: "input",
            message: "What is the id number of the employee being changed?"
        },
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        }, {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
        }, {
            name: "role_id",
            type: "input",
            message: "What is the employee's role id?"
        }, {
            name: "manager_id",
            type: "input",
            message: "What is the employee's manager id?"
        }
    ]).then(function(answers) {
        connection.query("UPDATE employee SET ? WHERE ?", [{
                first_name: answers.first_name,
                last_name: answers.last_name,
                role_id: answers.role_id,
                manager_id: answers.manager_id
            },
            { id: answers.id }
        ], function(err) {
            if (err) throw err;
            console.log("Employee updated");
            start()
        })
    })

}