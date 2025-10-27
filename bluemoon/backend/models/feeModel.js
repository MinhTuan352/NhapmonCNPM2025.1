// File: backend/models/feeModel.js
const db = require('../config/db');

const FeeType = {
    
    // US_011: Kế toán tạo loại phí mới
    create: async (feeData) => {
        const { name, description = null, amount, unit, created_by_user_id } = feeData;
        const [result] = await db.execute(
            'INSERT INTO fee_types (name, description, amount, unit, created_by_user_id) VALUES (?, ?, ?, ?, ?)',
            [name, description, amount, unit, created_by_user_id]
        );
        return { id: result.insertId, ...feeData };
    },

    // US_011: Kế toán cập nhật loại phí
    update: async (id, feeData) => {
        // Chỉ cho phép cập nhật các trường này
        const allowedFields = ['name', 'description', 'amount', 'unit', 'is_active'];
        const fields = [];
        const values = [];

        Object.keys(feeData).forEach(key => {
            if (allowedFields.includes(key) && feeData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(feeData[key]);
            }
        });

        if (fields.length === 0) return 0; // Không có gì để cập nhật

        values.push(id);
        const [result] = await db.execute(
            `UPDATE fee_types SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    },

    // US_011: Kế toán xem danh sách loại phí
    findAll: async () => {
        const [rows] = await db.query(
            `SELECT ft.*, u.full_name as created_by_name 
            FROM fee_types ft 
            LEFT JOIN users u ON ft.created_by_user_id = u.id
            ORDER BY ft.is_active DESC, ft.name`
        );
        return rows;
    },

    // US_011: Kế toán hủy kích hoạt loại phí (Vẫn giữ lịch sử)
    deactivate: async (id) => {
        const [result] = await db.execute(
            'UPDATE fee_types SET is_active = false WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    },
    
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM fee_types WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = FeeType;