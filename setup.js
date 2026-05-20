// setup.js - النسخة المعدلة
const Database = require('better-sqlite3');

// احذف قاعدة البيانات القديمة لو موجودة (اختياري)
try {
    require('fs').unlinkSync('nyondo_hardware.db');
    console.log('Old database deleted');
} catch(e) {
    console.log('No old database found');
}

// اعمل قاعدة بيانات جديدة
const db = new Database('nyondo_hardware.db');

// Create products table (من غير UNIQUE constraint)
db.exec(`
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL
)
`);

// Create users table
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'attendant'
)
`);

// Insert products - استخدم INSERT OR IGNORE عشان تتجنب التكرار
const insertProduct = db.prepare('INSERT OR IGNORE INTO products (name, description, price) VALUES (?, ?, ?)');
const insertProducts = db.transaction((rows) => {
    for (const r of rows) insertProduct.run(...r);
});

insertProducts([
    ['Cement (bag)', 'Portland cement 50kg bag', 35000],
    ['Iron Sheet 3m', 'Gauge 30 roofing sheet 3m long', 110000],
    ['Paint 5L', 'Exterior wall paint white 5L', 60000],
    ['Nails 1kg', 'Common wire nails 1kg pack', 12000],
    ['Timber 2x4', 'Pine timber plank 2x4 per metre', 25000]
]);

// Insert users
const insertUser = db.prepare('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)');
const insertUsers = db.transaction((rows) => {
    for (const r of rows) insertUser.run(...r);
});

insertUsers([
    ['admin', 'admin123', 'admin'],
    ['fatuma', 'pass456', 'attendant'],
    ['wasswa', 'pass789', 'manager']
]);

// Verify
console.log('\n=== PRODUCTS ===');
console.table(db.prepare('SELECT * FROM products').all());

console.log('\n=== USERS ===');
console.table(db.prepare('SELECT * FROM users').all());

db.close();
console.log('\nDatabase setup complete!');