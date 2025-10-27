// File: backend/routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');

// US_012: Kế toán tạo hóa đơn (cho 1 hoặc nhiều cư dân)
router.post('/', checkAuth, checkRole(['accountance']), invoiceController.createInvoices);

// US_012: Cư dân xem danh sách hóa đơn của mình
router.get('/my', checkAuth, checkRole(['resident']), invoiceController.getMyInvoices);

// US_012: Cư dân khởi tạo thanh toán cho hóa đơn (bấm nút "Thanh toán" để lấy link)
router.post('/:id/pay', checkAuth, checkRole(['resident']), invoiceController.initiatePayment);

// US_012: Xử lý callback từ cổng thanh toán (giả lập)
router.get('/payment-callback', invoiceController.handlePaymentCallback);

module.exports = router;