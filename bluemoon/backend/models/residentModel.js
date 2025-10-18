// File: backend/models/residentModel.js
const db = require('../config/db');

const Resident = {
    create: async (residentData) => {
        const { fullName, apartmentNumber, phoneNumber, createdBy } = residentData;
        const [result] = await db.execute(
            'INSERT INTO residents (full_name, apartment_number, phone_number, created_by) VALUES (?,?,?,?)',
           
        );
        return { id: result.insertId,...residentData };
    }
};

module.exports = Resident;