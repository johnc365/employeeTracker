import inquirer from 'inquirer'
import pg from 'pg'
import { pool, connectToDb } from './db/connection.js'
await connectToDb();

const viewDepartments = async function() {
    const {rows} = await pool.query('SELECT * FROM department');
    console.table(rows);
};

const viewRoles = async function() {
    const {rows} = await pool.query('SELECT * FROM role');
    console.table(rows);
};

const viewEmployees = async function() {
    const {rows} = await pool.query('SELECT * FROM employee');
    console.table(rows);
};

const addDepartment = async function() {
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
            } catch (err) {
                console.error('Error adding department:', err);
            }
        });
};

const addRole = async function() {
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
            }
        ]).then(async (answers) => {
            try {
                const insertCommand = 'INSERT INTO role (title, salary) VALUES ($1), ($2)';
                await pool.query(insertCommand, [answers.newRole, answers.newSalary]);
                console.log(`Role "${answers.newRole}" added successfully.`);
            } catch (err) {
                console.error('Error adding role:', err);
            }
        });
};

const addEmployee = async function() {
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
            }
        ]).then(async (answers) => {
            try {
                const insertCommand = 'INSERT INTO employee (first_name, last_name) VALUES ($1), ($2)';
                await pool.query(insertCommand, [answers.firstName, answers.lastName]);
                console.log(`Employee "${answers.firstName, answers.lastName}" added successfully.`);
            } catch (err) {
                console.error('Error adding employee:', err);
            }
        });
};

const updateRole = async function() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'selectedEmployee',
                message: 'Select an employee to update',
                choices: []
            },
            {
                type: 'list',
                name: 'selectedRole',
                message: 'Select a new role',
                choices: []
            }
        ]).then(async (answers) => {
            try {
                await pool.query(``);
            } catch (err) {
                console.error('Error updating employee:', err);
            }
        })
}

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