const Database = require('better-sqlite3');
const db = new Database('nyondo_hardware.db');

// سنحاول استخدام نفس نص الهجوم السابق لنرى إذا كان سيفشل
const userInput = "' OR '1'='1"; 

// الطريقة الآمنة: نستخدم العلامة ? مكان المدخلات
const query = "SELECT id, name, description, price FROM products WHERE name = ?";

try {
    // نمرر userInput كبارامتر منفصل هنا
    const results = db.prepare(query).all(userInput);
    
    console.log('\n--- [SAFE MODE] Searching for: ' + userInput + ' ---\n');
    
    if (results.length === 0) {
        console.log("No results found. (Secure coding prevented the attack!)");
    } else {
        console.table(results);
    }
} catch (err) {
    console.error('Error:', err.message);
}