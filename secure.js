// secure.js
const Database = require('better-sqlite3');
const db = new Database('nyondo_hardware.db');

// Validation functions
function validateInput(value, type) {
    if (type === 'name') {
        if (typeof value !== 'string') return false;
        if (value.length < 2) return false;
        if (/[<>;]/.test(value)) return false;
        return true;
    }
    if (type === 'username') {
        if (typeof value !== 'string') return false;
        if (value.length === 0) return false;
        if (/\s/.test(value)) return false;
        return true;
    }
    if (type === 'password') {
        if (typeof value !== 'string') return false;
        if (value.length < 6) return false;
        return true;
    }
    return true;
}

// Safe search with parameterized query
function searchProductSafe(name) {
    if (!validateInput(name, 'name')) {
        console.log(`[REJECTED] Invalid name: "${name}"`);
        return [];
    }
    const query = `SELECT * FROM products WHERE name LIKE '%' || ? || '%'`;
    console.log('[QUERY]:', query);
    console.log('[PARAM]:', name);
    const rows = db.prepare(query).all(name);
    console.log('[RESULT]:', rows);
    return rows;
}

// Safe login with parameterized query
function loginSafe(username, password) {
    if (!validateInput(username, 'username')) {
        console.log(`[REJECTED] Invalid username: "${username}"`);
        return null;
    }
    if (!validateInput(password, 'password')) {
        console.log(`[REJECTED] Invalid password (too short)`);
        return null;
    }
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    console.log('[QUERY]:', query);
    console.log('[PARAMS]:', username, password);
    const row = db.prepare(query).get(username, password);
    console.log('[RESULT]:', row);
    return row;
}

console.log('\n========== SECURE TESTS - Attacks should FAIL ==========\n');

console.log('--- Test 1: OR 1=1 attack ---');
console.log('Returns:', searchProductSafe("' OR 1=1--"), '\n');

console.log('--- Test 2: UNION attack ---');
console.log('Returns:', searchProductSafe("' UNION SELECT id,username,password,role FROM users--"), '\n');

console.log('--- Test 3: Login bypass ---');
console.log('Returns:', loginSafe("admin'--", 'anything'), '\n');

console.log('--- Test 4: Always true login ---');
console.log('Returns:', loginSafe("' OR '1'='1", "' OR '1'='1"), '\n');

console.log('\n========== VALIDATION TESTS ==========\n');

console.log('1. searchProductSafe("cement"):');
console.log(searchProductSafe('cement'));

console.log('\n2. searchProductSafe(""):');
console.log(searchProductSafe(''));

console.log('\n3. searchProductSafe("<script>"):');
console.log(searchProductSafe('<script>'));

console.log('\n4. loginSafe("admin", "admin123"):');
console.log(loginSafe('admin', 'admin123'));

console.log('\n5. loginSafe("admin", "ab"):');
console.log(loginSafe('admin', 'ab'));

console.log('\n6. loginSafe("ad min", "pass123"):');
console.log(loginSafe('ad min', 'pass123'));

db.close();