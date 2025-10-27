// File: backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');

// US_015: API để Admin soạn và gửi thông báo
router.post('/', checkAuth, checkRole(['bod']), notificationController.createNotification);

// US_015: API để Admin lấy danh sách tất cả thông báo đã gửi
router.get('/', checkAuth, checkRole(['bod']), notificationController.getAllNotifications);

// US_016: API để Cư dân lấy lịch sử thông báo của mình
router.get('/my', checkAuth, checkRole(['resident']), notificationController.getMyNotifications);

// US_016: API để Cư dân đánh dấu thông báo là đã đọc
router.put('/read/:id', checkAuth, checkRole(['resident']), notificationController.markNotificationAsRead);

module.exports = router;