// File: backend/models/userModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    // Tìm một user bằng username
    findByUsername: async (username) => {
        const [rows] = await db.execute(
            `SELECT users.*, roles.name as role_name
            FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE username =?`, [username]);
        return rows[0];
    },

    // Tìm một user bằng ID
    findById: async (id) => {
        const [rows] = await db.execute(
            `SELECT users.*, roles.name as role_name
            FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE users.id =?`, [id]);
        return rows[0];
    },

    // Tạo một user mới (dùng cho Admin)
    create: async (userData) => {
        const { username, password, fullName, roleId } = userData;
        
        // Mã hóa mật khẩu trước khi lưu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO users (username, password, full_name, role_id) VALUES (?,?,?,?)',
            [username, hashedPassword, fullName, roleId]
        );
        return { id: result.insertId,...userData };
    },

    // Cập nhật mật khẩu cho user
    updatePassword: async (id, newPassword) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    },

    // Lấy lịch sử đăng nhập của user
    getLoginHistory: async (userId) => {
        const [rows] = await db.execute(
            `SELECT lh.id, lh.user_id, u.full_name, u.username, lh.login_time, lh.ip_address, lh.user_agent
            FROM login_history lh
            JOIN users u ON lh.user_id = u.id
            WHERE lh.user_id = ?
            ORDER BY lh.login_time DESC`,
            [userId]);
        return rows;
    },

    // Lấy lịch sử đăng nhập của một user cụ thể (dùng cho Admin)
    getLoginHistoryForUser: async (userId) => {
        const [rows] = await db.execute(
            `SELECT lh.id, lh.user_id, u.full_name, u.username, lh.login_time, lh.ip_address, lh.user_agent
            FROM login_history lh
            JOIN users u ON lh.user_id = u.id
            WHERE lh.user_id = ?
            ORDER BY lh.login_time DESC`,
            [userId]);
        return rows;
    },

    // Lấy lịch sử đăng nhập của tất cả user
    getAllLoginHistory: async () => {
        const [rows] = await db.execute(
            `SELECT lh.id, lh.user_id, u.full_name, u.username, r.name as role_name, lh.login_time, lh.ip_address, lh.user_agent
            FROM login_history lh
            JOIN users u ON lh.user_id = u.id
            JOIN roles r ON u.role_id = r.id
            ORDER BY lh.login_time DESC`
        );
        return rows;
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