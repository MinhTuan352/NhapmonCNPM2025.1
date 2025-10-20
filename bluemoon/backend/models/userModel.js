// File: backend/models/userModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    // Tìm một user bằng email
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT users.*, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE email =?', [email]);
        return rows[0];
    },

    // Tìm một user bằng ID
    findById: async (id) => {
        const [rows] = await db.execute('SELECT users.*, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE users.id =?', [id]);
        return rows[0];
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
    },

    // Cập nhật mật khẩu cho user
    updatePassword: async (id, newPassword) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    },

    // Ghi nhận lịch sử đăng nhập
    recordLogin: async (userId, ipAddress, userAgent) => {
        await db.execute(
            'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?,?,?)',
            [userId, ipAddress, userAgent]
        );
    }
};

module.exports = User;