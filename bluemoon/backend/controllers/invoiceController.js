// File: backend/controllers/invoiceController.js
const Invoice = require('../models/invoiceModel');
const FeeType = require('../models/feeModel');
const User = require('../models/userModel');
const paymentService = require('../services/paymentService');

/**
 * Kế toán tạo hóa đơn (cho 1 hoặc nhiều Cư dân)
 * Body: { "user_ids": [2, 3], "fee_type_id": 1, "month": 10, "year": 2025, "due_date": "2025-10-31" }
 */
exports.createInvoices = async (req, res) => {
    try {
        const { user_ids, fee_type_id, month, year, due_date } = req.body;
        const created_by_user_id = req.user.id;

        // US_011 Constraint: Hạn thu phí phải sau thời điểm hiện tại
        if (new Date(due_date) <= new Date()) {
            return res.status(400).json({ message: 'Hạn thu phí phải ở tương lai.' });
        }
        
        const feeType = await FeeType.findById(fee_type_id);
        if (!feeType) return res.status(404).json({ message: 'Không tìm thấy loại phí.' });
        
        const amount = feeType.amount; // Tạm thời lấy giá cố định
        // (Logic nâng cao: Nếu là phí m2, bạn cần query diện tích căn hộ của user)

        const createdInvoices = [];
        for (const user_id of user_ids) {
            const userData = await User.findById(user_id);
            if (!userData || userData.role_name !== 'Cư dân') {
                console.warn(`Skipping user ID ${user_id}: Not a resident.`);
                continue;
            }
            
            const invoiceData = {
                user_id,
                fee_type_id,
                amount,
                month,
                year,
                issue_date: new Date(),
                due_date,
                created_by_user_id
            };
            const newInvoice = await Invoice.create(invoiceData);
            createdInvoices.push(newInvoice);
        }

        res.status(201).json({ message: `Tạo thành công ${createdInvoices.length} hóa đơn.`, invoices: createdInvoices });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// US_012: Cư dân xem danh sách hóa đơn của mình
exports.getMyInvoices = async (req, res) => {
    try {
        const userId = req.user.id;
        const invoices = await Invoice.findForUser(userId);
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// US_012: Cư dân khởi tạo thanh toán cho hóa đơn
exports.initiatePayment = async (req, res) => {
    try {
        const { id } = req.params; // Invoice ID
        const userId = req.user.id;

        const invoice = await Invoice.findById(id);
        if (!invoice) return res.status(404).json({ message: 'Không tìm thấy hóa đơn.' });
        if (invoice.user_id !== userId) return res.status(403).json({ message: 'Đây không phải hóa đơn của bạn.' });
        if (invoice.status === 'paid') return res.status(400).json({ message: 'Hóa đơn này đã được thanh toán.' });

        // URL mà cổng thanh toán sẽ redirect về
        const returnUrl = `${req.protocol}://${req.get('host')}/api/invoices/payment-callback`;
        
        const { paymentUrl, transactionCode } = paymentService.createPaymentUrl(invoice.id, invoice.amount, returnUrl);

        // (Lưu ý: Trong thực tế, bạn cần lưu transactionCode vào CSDL với trạng thái 'pending' ở đây)

        res.status(200).json({ message: 'Tạo link thanh toán thành công.', paymentUrl });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// US_012: Xử lý callback từ cổng thanh toán (giả lập)
exports.handlePaymentCallback = async (req, res) => {
    try {
        // Cổng thanh toán (giả lập) trả về qua query string
        const { invoice_id, amount, trans_code, status } = req.query;

        if (status === 'success') {
            const invoice = await Invoice.findById(invoice_id);
            if (invoice && invoice.status !== 'paid') {
                // Cập nhật CSDL
                await Invoice.updatePaymentStatus(invoice_id, 'Online', trans_code, amount);
                console.log(`[Callback] Hóa đơn #${invoice_id} đã được thanh toán thành công.`);
            }
            // Redirect Cư dân về trang "Thanh toán thành công"
            res.send('<h1>Thanh toán thành công!</h1><p>Cảm ơn bạn. Quay lại ứng dụng để xem chi tiết.</p>');
        } else {
            // Redirect Cư dân về trang "Thanh toán thất bại"
            res.status(400).send('<h1>Thanh toán thất bại!</h1><p>Vui lòng thử lại sau.</p>');
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};