// File: backend/routes/residentRoutes.js
const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');

// API để tạo cư dân mới
// 1. checkAuth: Phải đăng nhập
// 2. checkRole(['Admin']): Phải có vai trò là 'Admin'
router.post('/', checkAuth, checkRole(['Admin']), residentController.createResident);

module.exports = router;