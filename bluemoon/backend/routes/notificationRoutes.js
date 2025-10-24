// backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');

// US_015: API để Admin soạn và gửi thông báo
router.post('/', checkAuth, checkRole(['Admin']), notificationController.createNotification);

// US_015: API để Admin lấy danh sách tất cả thông báo đã gửi
router.get('/', checkAuth, checkRole(['Admin']), notificationController.getAllNotifications);

module.exports = router;