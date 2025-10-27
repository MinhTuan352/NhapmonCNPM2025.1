// File: backend/routes/residentRoutes.js
const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');

// US_001: API để tạo cư dân mới
// 1. checkAuth: Phải đăng nhập
// 2. checkRole(['Admin']): Phải có vai trò là 'Admin'
router.post('/', checkAuth, checkRole(['bod']), residentController.createResident);

// US_002 & US_005: API để lấy danh sách cư dân (có lọc)
router.get('/', checkAuth, checkRole(['bod']), residentController.getResidents);

// US_003: API để cập nhật thông tin cư dân
router.put('/:id', checkAuth, checkRole(['bod']), residentController.updateResident);

// Bổ sung US: API để xóa hồ sơ cư dân
router.delete('/:id', checkAuth, checkRole(['bod']), residentController.deleteResident);

module.exports = router;