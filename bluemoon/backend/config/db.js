// File: backend/config/db.js
const mysql = require('mysql2/promise');

// Sử dụng connection pool để quản lý kết nối hiệu quả
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bluemoon_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("MySQL Connection Pool Created.");

module.exports = pool;