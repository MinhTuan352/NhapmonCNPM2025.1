// File: backend/routes/feeRoutes.js
const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');

// US_011: API để Kế toán tạo loại phí mới
router.post('/', checkAuth, checkRole(['Kế toán']), feeController.createFeeType);

// US_011: API để Kế toán cập nhật loại phí
router.put('/:id', checkAuth, checkRole(['Kế toán']), feeController.updateFeeType);

// US_011: API để Kế toán xem danh sách loại phí
router.get('/', checkAuth, checkRole(['Kế toán']), feeController.getAllFeeTypes);

// US_011: API để Kế toán hủy kích hoạt loại phí
router.delete('/:id', checkAuth, checkRole(['Kế toán']), feeController.deactivateFeeType);

module.exports = router;