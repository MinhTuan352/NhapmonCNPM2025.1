// File: backend/models/userModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    // Tìm một user bằng email
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT users.*, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE email =?', [email]);
        return rows;
    },

    // Tạo một user mới (dùng cho Admin)
    create: async (userData) => {
        const { email, password, fullName, roleId } = userData;
        
        // Mã hóa mật khẩu trước khi lưu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO users (email, password, full_name, role_id) VALUES (?,?,?,?)',
            [email, hashedPassword, fullName, roleId]
        );
        return { id: result.insertId,...userData };
    }
};

module.exports = User;