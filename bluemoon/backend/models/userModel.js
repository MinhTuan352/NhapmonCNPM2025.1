// File: backend/models/userModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    // Tìm một user bằng username (ĐÃ SỬA LẠI TÊN BẢNG)
    findByUsername: async (username) => {
        const [rows] = await db.execute(
            `SELECT u.*, r.role_name as role_name
            FROM users u                  -- Sửa lại: users u
            JOIN roles r ON u.role_id = r.role_id -- Sửa lại: roles r
            WHERE u.username = ?`,
            [username]
        );
        return rows[0];
    },

    // Tìm một user bằng ID (ĐÃ SỬA LẠI TÊN BẢNG VÀ WHERE)
    findById: async (id) => {
        const [rows] = await db.execute(
            `SELECT u.*, r.role_name as role_name
            FROM users u                  -- Sửa lại: users u
            JOIN roles r ON u.role_id = r.role_id -- Sửa lại: roles r
            WHERE u.user_id = ?`,       
            [id]
        );
        return rows[0];
    },

    // Tạo một user mới (dùng cho Admin) (ĐÃ SỬA LẠI TÊN BẢNG)
    create: async (userData) => {
        const { username, password, fullName, roleId, email = null, phone = null, dob = null, gender = null, cccd = null, is_active = true } = userData;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = password ? await bcrypt.hash(password, salt) : null;

        const [result] = await db.execute(
            // Sửa lại tên bảng thành 'users'
            `INSERT INTO users (username, password, full_name, role_id, email, phone, dob, gender, cccd, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [username, hashedPassword, fullName, roleId, email, phone, dob, gender, cccd, is_active]
        );
        const { password: _, ...userDataWithoutPassword } = userData;
        // Trả về user_id (như trong init.sql)
        return { user_id: result.insertId, ...userDataWithoutPassword };
    },


    // Tìm tất cả user id theo tên role (ĐÃ SỬA LẠI TÊN BẢNG)
    findAllByRole: async (roleName) => {
        const [rows] = await db.execute(
            `SELECT u.user_id
            FROM users u                  -- Sửa lại: users u
            JOIN roles r ON u.role_id = r.role_id -- Sửa lại: roles r
            WHERE r.role_name = ?`,
            [roleName]
        );
        return rows.map(row => row.user_id);
    },

    // Cập nhật mật khẩu cho user (ĐÃ SỬA LẠI TÊN BẢNG VÀ CỘT ID)
    updatePassword: async (id, newPassword) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Sửa lại tên bảng thành 'users', cột thành 'user_id'
        await db.execute('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, id]);
    },

    // Lấy lịch sử đăng nhập của user (ĐÃ SỬA LẠI TÊN BẢNG VÀ CỘT ID)
    getLoginHistory: async (userId) => {
        const [rows] = await db.execute(
            `SELECT lh.log_id, lh.user_id, u.full_name, u.username, lh.login_time, lh.ip_address, lh.user_agent
            FROM login_history lh
            JOIN users u ON lh.user_id = u.user_id -- Sửa lại: users u
            WHERE lh.user_id = ?
            ORDER BY lh.login_time DESC`,
            [userId]
        );
        return rows;
    },

    // Lấy lịch sử đăng nhập của một user cụ thể (dùng cho Admin) (ĐÃ SỬA LẠI TÊN BẢNG VÀ CỘT ID)
    getLoginHistoryForUser: async (userId) => {
        const [rows] = await db.execute(
            `SELECT lh.log_id, lh.user_id, u.full_name, u.username, lh.login_time, lh.ip_address, lh.user_agent
            FROM login_history lh
            JOIN users u ON lh.user_id = u.user_id -- Sửa lại: users u
            WHERE lh.user_id = ?
            ORDER BY lh.login_time DESC`,
            [userId]
        );
        return rows;
    },

    // Lấy lịch sử đăng nhập của tất cả user (ĐÃ SỬA LẠI TÊN BẢNG VÀ CỘT ID)
    getAllLoginHistory: async () => {
        const [rows] = await db.execute(
            `SELECT lh.log_id, lh.user_id, u.full_name, u.username, r.role_name as role_name, lh.login_time, lh.ip_address, lh.user_agent
            FROM login_history lh
            JOIN users u ON lh.user_id = u.user_id     -- Sửa lại: users u
            JOIN roles r ON u.role_id = r.role_id     -- Sửa lại: roles r
            ORDER BY lh.login_time DESC`
        );
        return rows;
    },

    // Ghi nhận lịch sử đăng nhập (Đã sửa lỗi undefined)
    recordLogin: async (userId, ipAddress, userAgent) => {
        const safeIpAddress = ipAddress === undefined ? null : ipAddress;
        const safeUserAgent = userAgent === undefined ? null : userAgent;

        await db.execute(
            'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?,?,?)',
            [userId, safeIpAddress, safeUserAgent]
        );
    }
};

module.exports = User;