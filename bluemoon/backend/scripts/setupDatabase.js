// File: backend/scripts/setupDatabase.js

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    multipleStatements: true
};
const dbName = 'bluemoon_db';

// --- LOGIC CHÍNH CỦA SCRIPT ---
async function setupDatabase() {
    let connection;
    try {
        // 1. Kết nối đến MySQL Server (chưa vào database cụ thể)
        console.log('Đang kết nối đến MySQL Server...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Kết nối thành công.');

        // 2. Tạo database nếu nó chưa tồn tại
        console.log(`Đang kiểm tra/tạo database '${dbName}'...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.query(`USE \`${dbName}\`;`);
        console.log(`Database '${dbName}' đã được chọn.`);

        // 3. Đọc nội dung từ file init.sql
        console.log('Đang đọc file init.sql...');
        const sqlFilePath = path.join(__dirname, '..', 'database', 'init.sql');
        const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

        // 4. Thực thi toàn bộ kịch bản SQL
        console.log('Đang thực thi kịch bản SQL...');
        await connection.query(sqlScript);
        console.log('✅ Kịch bản đã được thực thi thành công!');
        console.log('Cơ sở dữ liệu đã được thiết lập xong.');

    } catch (error) {
        // 5. Xử lý lỗi nếu có
        console.error('❌ Đã xảy ra lỗi trong quá trình thiết lập database:');
        console.error(error);
        process.exit(1); // Thoát script với mã lỗi
    } finally {
        // 6. Luôn luôn đóng kết nối sau khi hoàn thành
        if (connection) {
            await connection.end();
            console.log('Đã đóng kết nối đến MySQL.');
        }
    }
}

// Chạy hàm chính
setupDatabase();