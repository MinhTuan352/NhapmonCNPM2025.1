// File: backend/controllers/authController.js
require('dotenv').config();

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// US_021: Xử lý đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm user trong DB
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 3. Tạo JSON Web Token (JWT)
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role_name
        };
        console.log('>>> [Controller] JWT_SECRET đang dùng để TẠO token:', process.env.JWT_SECRET);
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Đăng nhập thành công!', token });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// US_020: Xử lý tạo tài khoản mới (chỉ Admin được làm)
exports.createUser = async (req, res) => {
    try {
        // Dữ liệu user mới từ request body
        const { email, password, fullName, roleId } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng.' });
        }

        const newUser = await User.create({ email, password, fullName, roleId });
        res.status(201).json({ message: 'Tạo tài khoản thành công!', userId: newUser.id });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};