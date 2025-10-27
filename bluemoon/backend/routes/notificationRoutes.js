// File: backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');

// US_015: API để Admin soạn và gửi thông báo
router.post('/', checkAuth, checkRole(['Admin']), notificationController.createNotification);

// US_015: API để Admin lấy danh sách tất cả thông báo đã gửi
router.get('/', checkAuth, checkRole(['Admin']), notificationController.getAllNotifications);

// US_016: API để Cư dân lấy lịch sử thông báo của mình
router.get('/my', checkAuth, checkRole(['Cư dân']), notificationController.getMyNotifications);

// US_016: API để Cư dân đánh dấu thông báo là đã đọc
router.put('/read/:id', checkAuth, checkRole(['Cư dân']), notificationController.markNotificationAsRead);

module.exports = router;