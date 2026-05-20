// queries.js
const Database = require('better-sqlite3');
const db = new Database('nyondo_hardware.db');  // اتأكد من اسم الملف

console.log('=== QUERY A: All products ===');
console.table(db.prepare('SELECT * FROM products').all());

console.log('\n=== QUERY B: Name and price only ===');
console.table(db.prepare('SELECT name, price FROM products').all());

console.log('\n=== QUERY C: Product with id = 3 ===');
console.table(db.prepare('SELECT * FROM products WHERE id = 3').get());

console.log('\n=== QUERY D: Products with "sheet" in name ===');
console.table(db.prepare("SELECT * FROM products WHERE name LIKE '%sheet%'").all());

console.log('\n=== QUERY E: Sorted by price (highest first) ===');
console.table(db.prepare('SELECT * FROM products ORDER BY price DESC').all());

console.log('\n=== QUERY F: Top 2 most expensive ===');
console.table(db.prepare('SELECT * FROM products ORDER BY price DESC LIMIT 2').all());

console.log('\n=== QUERY G: Update cement price to 38,000 ===');
db.prepare('UPDATE products SET price = 38000 WHERE id = 1').run();
console.table(db.prepare('SELECT * FROM products WHERE id = 1').get());

db.close();