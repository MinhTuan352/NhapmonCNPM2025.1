// backend/models/incidentModel.js
const db = require('../config/db');

const Incident = {
    // US_017: Cư dân báo cáo sự cố
    create: async (incidentData) => {
        const { title, description, location, reported_by_user_id } = incidentData;
        const [result] = await db.execute(
            'INSERT INTO incidents (title, description, location, reported_by_user_id) VALUES (?, ?, ?, ?)',
            [title, description, location, reported_by_user_id]
        );
        return { id: result.insertId, ...incidentData, status: 'Đã nộp' };
    },

    // US_017: Cư dân xem các sự cố đã báo cáo của mình
    findForUser: async (userId) => {
        const [rows] = await db.execute(
            'SELECT * FROM incidents WHERE reported_by_user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    },

    // US_017: Admin xem tất cả các sự cố đã được báo cáo
    findAll: async () => {
        const [rows] = await db.query(
            `SELECT i.*, u.full_name as reported_by_name, u.username as reported_by_username
             FROM incidents i
             JOIN users u ON i.reported_by_user_id = u.id
             ORDER BY i.created_at DESC`
        );
        return rows;
    }
};

module.exports = Incident;