// File: backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// API cho US_021
router.post('/login', authController.login);

// API cho US_020 (Tạm thời chưa có bảo vệ, sẽ thêm ở bước sau)
router.post('/users', authController.createUser);

module.exports = router;