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
        return { id: result.insertId,...residentData };
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM residents');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM residents WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, residentData) => {
        const { fullName, apartmentNumber, phoneNumber, status } = residentData;
        
        await db.execute(
            'UPDATE residents SET full_name = ?, apartment_number = ?, phone_number = ?, status = ? WHERE id = ?',
            [fullName, apartmentNumber, phoneNumber, status || 'active', id]
        );
        
        return { id, ...residentData };
    },

    delete: async (id) => {
        await db.execute('DELETE FROM residents WHERE id = ?', [id]);
        return { id };
    }
};

module.exports = Resident;