import inquirer from 'inquirer'
import { pool, connectToDb } from './db/connection.js'
await connectToDb();

const departmentList = async function () {
    const { rows } = await pool.query('SELECT * FROM department');
    const departmentArray = rows.map(({id, name}) => ({name: name, value: id}));
    return departmentArray;
}

const rolesList = async function () {
    const { rows } = await pool.query('SELECT * FROM role');
    const titleArray = rows.map(({title, id}) => ({name: title, value: id}));
    return titleArray;
}

const managerList = async function () {
    const { rows } = await pool.query('SELECT * FROM employee WHERE role_id = 4');
    const managerArray = rows.map(({first_name, last_name, id}) => ({name: first_name + ' ' + last_name, value: id}));
    return managerArray;
}

const employeeList = async function () {
    const { rows } = await pool.query('SELECT * FROM employee');
    const managerArray = rows.map(({first_name, last_name, id}) => ({name: first_name + ' ' + last_name, value: id}));
    return managerArray;
}

const viewDepartments = async function () {
    const { rows } = await pool.query('SELECT * FROM department');
    console.table(rows);
    cli();
};

const viewRoles = async function () {
    const { rows } = await pool.query('SELECT * FROM role');
    console.table(rows);
    cli();
};

const viewEmployees = async function () {
    const { rows } = await pool.query('SELECT * FROM employee');
    console.table(rows);
    cli();
};

const addDepartment = async function () {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What department would you like to add?'
            }
        ]).then(async (answers) => {
            try {
                const insertCommand = 'INSERT INTO department (name) VALUES ($1)';
                await pool.query(insertCommand, [answers.newDepartment]);
                console.log(`Department "${answers.newDepartment}" added successfully.`);
                cli();
            } catch (err) {
                console.error('Error adding department:', err);
            }
        });
};

const addRole = async function () {
   const departmentChoices = await departmentList();
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'What role would you like to add?',
            },
            {
                type: 'input',
                name: 'newSalary',
                message: 'What is the salary for this role?',
            },
            {
                type: 'list',
                name: 'newDepartment',
                message: 'What is the department for this role?',
                choices: departmentChoices,
            },
        ]).then(async (answers) => {
            console.log(answers);
            try {
                const insertCommand = 'INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)';
                await pool.query(insertCommand, [answers.newRole, answers.newSalary, answers.newDepartment]);
                console.log(`Role "${answers.newRole}" added successfully.`);
                cli();
            } catch (err) {
                console.error('Error adding role:', err);
            }
        });
};

const addEmployee = async function () {
    const titleChoices = await rolesList();
    const managerChoices = await managerList();
    managerChoices.push({name: "No manager", value: null});
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of the employee?',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the employee?',
            },
            {
                type: 'list',
                name: 'role',
                message: "What is the employee's job title?",
                choices: titleChoices,
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: managerChoices,
            },
        ]).then(async (answers) => {
            try {
                const insertCommand = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
                await pool.query(insertCommand, [answers.firstName, answers.lastName, answers.role, answers.manager]);
                console.log(`Employee "${answers.firstName, answers.lastName}" added successfully.`);
                cli();
            } catch (err) {
                console.error('Error adding employee:', err);
            }
        });
};

const updateRole = async function() {
    const employeeChoices = await employeeList();
    const roleChoices = await rolesList();
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'selectedEmployee',
                message: 'Select an employee to update',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'selectedRole',
                message: 'Select a new role',
                choices: roleChoices,
            }
        ]).then(async (answers) => {
            try {
                await pool.query(`UPDATE employee SET role_id = ${answers.selectedRole} WHERE id = ${answers.selectedEmployee}`);
                console.log(`Employee role updated successfully`);
                cli();
            } catch (err) {
                console.error('Error updating employee:', err);
            }
        });
};
const cli = function () {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
            }
        ]).then((answers) => {
            if (answers.action === 'View all departments') {
                viewDepartments();
            } else if (answers.action === 'View all roles') {
                viewRoles();
            } else if (answers.action === 'View all employees') {
                viewEmployees();
            } else if (answers.action === 'Add a department') {
                addDepartment();
            } else if (answers.action === 'Add a role') {
                addRole();
            } else if (answers.action === 'Add an employee') {
                addEmployee();
            } else if (answers.action === 'Update an employee role') {
                updateRole();
            };
        });
};

cli();