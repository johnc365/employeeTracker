INSERT INTO department (name)
VALUES
('legal'),
('operations'),
('sales'),
('management');

INSERT INTO role (title, salary, department)
VALUES
('lawyer', 200000, 1),
('technician', 40000, 2),
('salesman', 80000, 3),
('manager', 120000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Don', 'Roberts', 1, NULL),
('Jack', 'Hanson', 2, 4),
('Robert', 'Wilson', 3, NULL),
('Gary', 'Green', 4, NULL),
('Henry', 'Daws', 2, 4);