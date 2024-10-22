import inquirer from 'inquirer'
import pg from 'pg'
import { pool, connectToDb } from './db/connection.js'
await connectToDb();

const viewDepartments = async function() {
    const {rows} = await pool.query('SELECT * FROM department');
    console.table(rows);
}

const viewRoles = async function() {
    const {rows} = await pool.query('SELECT * FROM role');
    console.table(rows);
}

const viewEmployees = async function() {
    const {rows} = await pool.query('SELECT * FROM employee');
    console.table(rows);
}

const addDepartment = async function() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What department would you like to add?'
            }
        ]).then((answers) => {
            
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
        }
    });