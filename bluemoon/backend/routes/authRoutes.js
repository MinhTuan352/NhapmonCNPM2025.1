// File: backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Import các middleware nếu cần thiết
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');

// Routes công khai (Không cần login)
// API cho user đăng nhập (US_021)
router.post('/login', authController.login);

// Routes bảo vệ (Cần xác thực)
// API đổi mật khẩu (US_021)
router.post('/change-password', checkAuth, authController.changePassword);

// API cho user xem lịch sử đăng nhập của mình (US_021)
router.get('/login-history', checkAuth, authController.getLoginHistory);

// API cho user đăng xuất (US_021)
router.post('/logout', checkAuth, authController.logout);

// Routes cho admin
// API tạo user mới (Chỉ Admin được phép)
router.post('/users', checkAuth, checkRole(['Admin']), authController.createUser);

module.exports = router;