// File: backend/controllers/incidentController.js
const Incident = require('../models/incidentModel');

// US_017: Cư dân báo cáo sự cố
exports.createIncident = async (req, res) => {
    try {
        const { title, description, location } = req.body;
        const reported_by_user_id = req.user.id;
        if (!title || !description ) {
            return res.status(400).json({ message: 'Tiêu đề và mô tả là tiêu chí bắt buộc' });
        }
        const incidentData = { title, description, location, reported_by_user_id };
        const newIncident = await Incident.create(incidentData);
        res.status(201).json({ message: 'Báo cáo sự cố thành công!', incident: newIncident });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi báo cáo sự cố', error: error.message });
    }
};

// US_017: Cư dân xem các sự cố đã báo cáo của mình
exports.getMyIncidents = async (req, res) => {
    try {
        const userId = req.user.id;
        const incidents = await Incident.findForUser(userId);
        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách sự cố', error: error.message });
    }
};

// US_017: Admin xem tất cả các sự cố đã được báo cáo
exports.getAllIncidents = async (req, res) => {
    try {
        const incidents = await Incident.findAll();
        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách sự cố', error: error.message });
    }
};