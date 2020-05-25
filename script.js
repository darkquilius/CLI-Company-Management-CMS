var mysql = require("mysql");
var inquirer = require("inquirer");
const consoleTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Kujo1124",
    database: "company_db"
});

connection.connect(function(err) {
    if (err) throw err;
    start()
});

async function start() {
    let start = await inquirer.prompt({
        name: "start",
        type: "list",
        message: "What would you like to do?",
        choices: ["View",
            "Add",
            "Update",
            "Remove",
            "End"
        ]
    })

    if (start.start === "View") {
        await viewNav()
    } else if (start.start === "Add") {
        await addNav()
    } else if (start.start === "Remove") {
        await removeNav()
    } else if (start.start === "Update") {
        await updateNav()
    } else {
        connection.end()
    }
}

async function viewNav() {
    let answers = await inquirer.prompt({
        name: "view",
        type: "list",
        message: "View by...?",
        choices: ["Employees",
            "Employees by Department",
            "Roles",
            "Roles by Department",
            "Departments",
            "Back"
        ]
    })
    if (answers.view === "Employees") {
        viewEmployee()
    } else if (answers.view === "Employees by Department") {
        viewEmployeesByDepartment()
    } else if (answers.view === "Roles") {
        viewRole()
    } else if (answers.view === "Roles by Department") {
        viewRolesByDepartment()
    } else if (answers.view === "Departments") {
        viewDepartment()
    } else {
        start()
    }

}

async function addNav() {
    let answers = await inquirer.prompt({
        name: "add",
        type: "list",
        message: "Add...",
        choices: ["Employee",
            "Role",
            "Department",
            "Back"
        ]
    })
    if (answers.add === "Employee") {
        addEmployee()
    } else if (answers.add === "Role") {
        addRole()
    } else if (answers.add === "Department") {
        addDepartment()
    } else {
        start()
    }
}

async function updateNav() {
    let answers = await inquirer.prompt({
        name: "update",
        type: "list",
        message: "Update by...",
        choices: ["Employee",
            "Role",
            "Department",
            "Back"
        ]
    })
    if (answers.update === "Employee") {
        updateEmployee()
    } else if (answers.update === "Role") {
        updateRole()
    } else if (answers.update === "Department") {
        updateDepartment()
    } else {
        start()
    }
}

async function removeNav() {
    let answers = await inquirer.prompt({
        name: "remove",
        type: "list",
        message: "Remove by...",
        choices: ["Employee",
            "Role",
            "Department",
            "Back"
        ]
    })
    if (answers.remove === "Employee") {
        removeEmployee()
    } else if (answers.remove === "Role") {
        removeRole()
    } else if (answers.remove === "Department") {
        removeDepartment()
    } else {
        start()
    }
}

function viewEmployeesByDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What is the id number of the department you are looking for?",
        validate: (name) => {
            let regexp = /[0-9]/gi;
            let result = name.match(regexp) ? true : "   Please input proper value";
            return result
        }
    }).then(function(answers) {
        connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.?", { id: answers.department }, function(err, res) {
            if (err) throw err;
            console.table(res)
            start()
        })
    })
}

function viewRolesByDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What is the id number of the department you are looking for?",
        validate: (name) => {
            let regexp = /[0-9]/gi;
            let result = name.match(regexp) ? true : "   Please input proper value";
            return result
        }
    }).then(function(answers) {
        connection.query("SELECT department.name, role.title, role.salary FROM role LEFT JOIN department ON role.department_id = department.id WHERE department.?", { id: answers.department }, function(err, res) {
            if (err) throw err;
            console.table(res)
            start()
        })
    })
}

function viewEmployee() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.role_id, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id ORDER BY department_id", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res)
        start()
    })
}

function addEmployee() {

    inquirer.prompt([{
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
            validate: (name) => {
                let regexp = /[A-Z]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }, {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
            validate: (name) => {
                let regexp = /[A-Z]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }, {
            name: "role_id",
            type: "input",
            message: "What is the employee's role id?",
            validate: (name) => {
                let regexp = /[0-9]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }, {
            name: "manager_id",
            type: "input",
            message: "What is the employee's manager id?",
            validate: (name) => {
                let regexp = /[0-9]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
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
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.role_id, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id ORDER BY department_id", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);

        inquirer.prompt([{
                name: "id",
                type: "input",
                message: "What is the id number of the employee being changed?",
                validate: (name) => {
                    let regexp = /[0-9]/gi;
                    let result = name.match(regexp) ? true : "   Please input proper value";
                    return result
                }
            },
            {
                name: "first_name",
                type: "input",
                message: "What is the employee's first name?",
                validate: (name) => {
                    let regexp = /[A-Z]/gi;
                    let result = name.match(regexp) ? true : "   Please input proper value";
                    return result
                }
            }, {
                name: "last_name",
                type: "input",
                message: "What is the employee's last name?",
                validate: (name) => {
                    let regexp = /[A-Z]/gi;
                    let result = name.match(regexp) ? true : "   Please input proper value";
                    return result
                }
            }, {
                name: "role_id",
                type: "input",
                message: "What is the employee's role id?",
                validate: (name) => {
                    let regexp = /[0-9]/gi;
                    let result = name.match(regexp) ? true : "   Please input proper value";
                    return result
                }
            }, {
                name: "manager_id",
                type: "input",
                message: "What is the employee's manager id?",
                validate: (name) => {
                    let regexp = /[0-9]/gi;
                    let result = name.match(regexp) ? true : "   Please input proper value";
                    return result
                }
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
    })
}

function removeEmployee() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.role_id, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id ORDER BY department_id", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);

        inquirer.prompt({
            name: "id",
            type: "input",
            message: "What is the id number of the employee being removed?",
            validate: (name) => {
                let regexp = /[0-9]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }).then(function(answer) {
            connection.query("DELETE FROM employee WHERE ?", { id: answer.id }, function(err) {
                if (err) throw err;
                console.log("Employee removed");
                start()
            })
        })
    })
}

function viewRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res)
        start()
    })
}

function addRole() {
    inquirer.prompt([{
            name: "title",
            type: "input",
            message: "What is the role's title?",
            validate: (name) => {
                let regexp = /[A-Z]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }, {
            name: "salary",
            type: "input",
            message: "What is the role's salary?",
            validate: (name) => {
                let regexp = /[0-9]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }, {
            name: "department_id",
            type: "input",
            message: "What is the role's department id?",
            validate: (name) => {
                let regexp = /[0-9]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
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

function updateRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);

        inquirer.prompt([{
                name: "id",
                type: "input",
                message: "What is the id number of the role to be changed?",
                validate: (name) => {
                    let regexp = /[0-9]/gi;
                    let result = name.match(regexp) ? true : "   Please input proper value";
                    return result
                }
            },
            {
                name: "title",
                type: "input",
                message: "What is the role's title?",
                validate: (name) => {
                    let regexp = /[A-Z]/gi;
                    let result = name.match(regexp) ? true : "   Please input proper value";
                    return result
                }
            }, {
                name: "salary",
                type: "input",
                message: "What is the role's salary?",
                validate: (name) => {
                    let regexp = /[0-9]/gi;
                    let result = name.match(regexp) ? true : "   Please input proper value";
                    return result
                }
            }, {
                name: "department_id",
                type: "input",
                message: "What is the role's department id?",
                validate: (name) => {
                    let regexp = /[0-9]/gi;
                    let result = name.match(regexp) ? true : "   Please input proper value";
                    return result
                }
            }
        ]).then(function(answers) {
            connection.query("UPDATE role SET ? WHERE ?", [{
                    title: answers.title,
                    salary: answers.salary,
                    department_id: answers.department_id
                },
                { id: answers.id }
            ], function(err) {
                if (err) throw err;
                console.log("role updated");
                start()
            })
        })
    })
}

function removeRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);
        console.log("");
        console.log("Note: Employees associated with role will persist. Remember to update employees...");
        console.log("");
        console.log("      To skip, input 0. Ignore successful removal prompt...")
        console.log("");
        inquirer.prompt({
            name: "id",
            type: "input",
            message: "What is the id number of the role being removed?",
            validate: (name) => {
                let regexp = /[0-9]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }).then(function(answer) {
            connection.query("DELETE FROM role WHERE ?", { id: answer.id }, function(err) {
                if (err) throw err;
                console.log("Role removed");
                start()
            })
        })
    })
}

function viewDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res)
        start()
    })
}

function addDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What is the department's name?",
        validate: (name) => {
            let regexp = /[A-Z]/gi;
            let result = name.match(regexp) ? true : "   Please input proper value";
            return result
        }
    }).then(function(answers) {
        connection.query("INSERT INTO department SET ?", { name: answers.department }, function(err) {
            if (err) throw err;
            console.log("Department added"),
                start()
        })
    })
}

function updateDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res)
        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "What is the id number of the department to be changed?",
            validate: (name) => {
                let regexp = /[0-9]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }, {
            name: "name",
            type: "input",
            message: "What is the department's name?",
            validate: (name) => {
                let regexp = /[A-Z]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }]).then(function(answers) {
            connection.query("UPDATE department SET ? WHERE ?", [{ name: answers.name }, { id: answers.id }],
                function(err) {
                    if (err) throw err;
                    console.log("Department updated")
                    start()
                })
        })
    })
}

function removeDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);
        console.log("");
        console.log("Note: Employees and roles associated with department will persist. Remember to update employees and roles...");
        console.log("");
        console.log("      To skip, input 0. Ignore successful removal prompt...");
        console.log("");
        inquirer.prompt({
            name: "id",
            type: "input",
            message: "What is the id number of the department being removed?",
            validate: (name) => {
                let regexp = /[0-9]/gi;
                let result = name.match(regexp) ? true : "   Please input proper value";
                return result
            }
        }).then(function(answer) {
            connection.query("DELETE FROM department WHERE ?", { id: answer.id }, function(err) {
                if (err) throw err;
                console.log("Department removed");
                start()
            })
        })
    })
}