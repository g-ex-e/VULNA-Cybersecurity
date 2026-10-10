-- ✅ Création de la table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL
);

INSERT INTO users (username, password, role) VALUES
('sjobs', 'q4HZjhux3YfQ', 'employee'),
('adupont', 'rz9XHcSGsYmQ', 'employee'),
('rmartin', 'H7wKagA4Tscx', 'admin'),
('bob', 'Q6rdbAyuBSWg', 'employee'),
('mallory', 'vDrw2enzdRGy', 'employee');

-- ✅ Création de la table des clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    company VARCHAR(100)
);

INSERT INTO clients (name, email, company) VALUES
('John Smith', 'john.smith@email.com', 'Acme Corp'),
('Sarah Johnson', 'sarah.johnson@email.com', 'NeoMarket'),
('David Lee', 'david.lee@email.com', 'Malo Marketing'),
('Lisa Brown', 'lisa.brown@email.com', 'FinanceX'),
('Chris Wilson', 'chris.wilson@email.com', 'WebSecure');

-- ✅ Table des transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO transactions (user_id, amount) VALUES
(1, 500.00),
(2, 1200.50),
(3, 8999.99),
(4, 50.75),
(5, 75.20);

-- ✅ Table de l'historique des connexions
CREATE TABLE login_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

INSERT INTO login_history (user_id, ip_address) VALUES
(1, '192.168.1.10'),
(2, '192.168.1.25'),
(3, '10.0.0.5'),
(4, '172.16.0.45'),
(5, '192.168.1.100');

-- ✅ Table du personnel
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(100),
    email VARCHAR(100),
    position VARCHAR(50)
);

INSERT INTO staff (fullname, email, position) VALUES
('Richard Martin', 'richard.m@email.com', 'CEO'),
('Anna Baker', 'anna.b@email.com', 'Marketing Director'),
('Samuel Green', 'samuel.g@email.com', 'Lead Developer');

-- ✅ Table de configuration
CREATE TABLE config (
    id SERIAL PRIMARY KEY,
    setting_name VARCHAR(100) NOT NULL,
    setting_value TEXT NOT NULL
);

INSERT INTO config (setting_name, setting_value) VALUES
('site_name', 'NeoMarket App'),
('maintenance_mode', 'false');
