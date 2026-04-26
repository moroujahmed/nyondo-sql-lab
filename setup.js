const Database = require('better-sqlite3');
const db = new Database('nyondo_hardware.db');

/* =========================
   CREATE TABLES FIRST
========================= */
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'attendant'
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price REAL NOT NULL
);
`);

/* =========================
   CLEAN OLD DATA (SAFE NOW)
========================= */
db.exec("DELETE FROM users;");
db.exec("DELETE FROM products;");

/* =========================
   INSERT USERS
========================= */
const insertUser = db.prepare(`
INSERT OR IGNORE INTO users (username, password, role)
VALUES (?, ?, ?)
`);

insertUser.run('admin', 'admin123', 'admin');
insertUser.run('fatuma', 'pass456', 'attendant');
insertUser.run('wasswa', 'pass789', 'manager');

/* =========================
   INSERT PRODUCTS (5 ONLY)
========================= */
const insertProduct = db.prepare(`
INSERT OR IGNORE INTO products (name, description, price)
VALUES (?, ?, ?)
`);

insertProduct.run('Cement', '50kg bag', 35000);
insertProduct.run('Iron Sheet', 'Roofing sheet', 110000);
insertProduct.run('Paint 5L', 'Wall paint white', 60000);
insertProduct.run('Nails 1kg', 'Iron nails pack', 12000);
insertProduct.run('Timber 2x4', 'Wood plank', 25000);

/* =========================
   OUTPUT
========================= */
console.log("USERS:");
console.table(db.prepare("SELECT * FROM users").all());

console.log("PRODUCTS:");
console.table(db.prepare("SELECT * FROM products").all());