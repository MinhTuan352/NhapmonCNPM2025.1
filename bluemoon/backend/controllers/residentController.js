// File: backend/controllers/residentController.js
const Resident = require('../models/residentModel');

// US_001: Tạo hồ sơ cư dân mới (Chỉ Admin được phép)
exports.createResident = async (req, res) => {
    try {
        const { fullName, apartmentNumber, phoneNumber, status } = req.body;
        
        // Lấy ID của người dùng Admin đang đăng nhập từ token (sẽ được middleware thêm vào)
        const createdBy = req.user.id; 

        const newResident = await Resident.create({ fullName, apartmentNumber, phoneNumber, createdBy: req.user.id, status: status || 'Đang sinh sống' });
        res.status(201).json({ message: 'Tạo hồ sơ cư dân thành công!', resident: newResident });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};