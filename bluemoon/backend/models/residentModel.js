// File: backend/models/residentModel.js
const db = require('../config/db');

// US_001: Tạo hồ sơ cư dân mới (Chỉ Admin được phép)
const Resident = {
    create: async (residentData) => {
        const { fullName, apartmentNumber, phoneNumber, createdBy, status } = residentData;
        const [result] = await db.execute(
            'INSERT INTO residents (full_name, apartment_number, phone_number, created_by, status) VALUES (?,?,?,?,?)',
            [fullName, apartmentNumber, phoneNumber, createdBy, status || 'Đang sinh sống']
        );
        return { id: result.insertId,...residentData, status: status || 'Đang sinh sống'};
    },

    /**
     * US_002 & US_005: Lấy danh sách cư dân (có lọc)
     * @param {object} filters - Đối tượng chứa các tiêu chí lọc (name, apartment, status)
     */
    findAll: async (filters = {}) => {
        let query = 'SELECT * FROM residents WHERE 1=1';
        const params = [];

        // US_005: Thêm điều kiện lọc
        if (filters.name) {
            query += ' AND full_name LIKE ?';
            params.push(`%${filters.name}%`);
        }
        if (filters.apartment) {
            query += ' AND apartment_number = ?';
            params.push(filters.apartment);
        }
        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        const [rows] = await db.execute(query, params);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM residents WHERE id = ?', [id]);
        return rows[0];
    },

    /**
     * US_003: Cập nhật thông tin cư dân
     * Cập nhật động các trường được cung cấp trong residentData
     */
    update: async (id, residentData) => {
        const allowedFields = ['full_name', 'apartment_number', 'phone_number', 'status'];
        const fields = [];
        const values = [];
        
        // Tự động xây dựng câu lệnh SET
        Object.keys(residentData).forEach(key => {
            // Chỉ cho phép cập nhật các trường hợp lệ
            if (allowedFields.includes(key) && residentData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(residentData[key]);
            }
        });

        if (fields.length === 0) {
            throw new Error('Không có trường hợp lệ để cập nhật.');
        }

        values.push(id); // Thêm id vào cuối mảng cho điều kiện WHERE
        const query = `UPDATE residents SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result.affectedRows > 0 ? { id, ...residentData } : null;
    },

    // Bổ sung US: Xóa hồ sơ cư dân
    delete: async (id) => {
        await db.execute('DELETE FROM residents WHERE id = ?', [id]);
        return { id };
    }
};

module.exports = Resident;