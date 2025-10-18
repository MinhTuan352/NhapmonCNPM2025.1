// File: backend/config/db.js
const mysql = require('mysql2/promise');

// Sử dụng connection pool để quản lý kết nối hiệu quả hơn
const pool = mysql.createPool({
    host: 'localhost', // Thay bằng host của bạn
    user: 'root',      // Thay bằng user của bạn
    password: 'password', // Thay bằng password của bạn
    database: 'bluemoon_db', // Thay bằng tên database của bạn
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("MySQL Connection Pool Created.");

module.exports = pool;