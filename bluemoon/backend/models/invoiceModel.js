// File: backend/models/invoiceModel.js
const db = require('../config/db');

const Invoice = {
    // US_012: Kế toán tạo hóa đơn cho cư dân
    create: async (invoiceData) => {
        const { user_id, fee_type_id, amount, month, year, issue_date, due_date, created_by_user_id } = invoiceData;
        const [result] = await db.execute(
            'INSERT INTO invoices (user_id, fee_type_id, amount, month, year, issue_date, due_date, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, fee_type_id, amount, month, year, issue_date, due_date, created_by_user_id]
        );
        return { id: result.insertId, ...invoiceData, status: 'unpaid' };
    },

    // US_012: Cư dân xem danh sách hóa đơn của mình
    findForUser: async (userId) => {
        const [rows] = await db.query(
            `SELECT i.*, ft.name as fee_name, ft.unit as fee_unit
             FROM invoices i
             JOIN fee_types ft ON i.fee_type_id = ft.id
             WHERE i.user_id = ?
             ORDER BY i.year DESC, i.month DESC, i.due_date DESC`,
            [userId]
        );
        return rows;
    },

    // US_013: Lấy tất cả hóa đơn chưa thanh toán hoặc quá hạn (cho Job)
    findUnpaidAndOverdue: async () => {
        const [rows] = await db.query(
            `SELECT 
                i.*, 
                u.full_name as user_name, 
                u.username as user_username,
                ft.name as fee_name
            FROM invoices i
            JOIN users u ON i.user_id = u.id
            JOIN fee_types ft ON i.fee_type_id = ft.id
            WHERE i.status = 'unpaid' OR i.status = 'overdue'`
        );
        return rows;
    },
    
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM invoices WHERE id = ?', [id]);
        return rows[0];
    },

    // US_012: Cập nhật hóa đơn sang 'Đã thanh toán' khi thanh toán thành công
    updatePaymentStatus: async (invoiceId, paymentMethod, transactionCode, amount) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Cập nhật hóa đơn
            await connection.execute(
                "UPDATE invoices SET status = 'paid', payment_method = ?, transaction_id = ?, paid_at = CURRENT_TIMESTAMP WHERE id = ?",
                [paymentMethod, transactionCode, invoiceId]
            );

            // 2. Ghi lại giao dịch chi tiết
            await connection.execute(
                "INSERT INTO transactions (invoice_id, amount, payment_method, transaction_code, status) VALUES (?, ?, ?, ?, 'success')",
                [invoiceId, amount, paymentMethod, transactionCode]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
    
    // US_013: Đánh dấu hóa đơn là 'Quá hạn' nếu quá hạn thanh toán
    markAsOverdue: async (invoiceId) => {
         await db.execute(
            "UPDATE invoices SET status = 'overdue' WHERE id = ? AND status = 'unpaid'",
            [invoiceId]
        );
    }
};

module.exports = Invoice;