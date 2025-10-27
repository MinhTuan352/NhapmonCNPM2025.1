// File: backend/controllers/residentController.js
const Resident = require('../models/residentModel');

// US_001: Tạo hồ sơ cư dân mới (Chỉ Admin được phép)
exports.createResident = async (req, res) => {
    try {
        const { fullName, apartmentNumber, phoneNumber, status } = req.body;
        
        // Lấy ID của người dùng Admin đang đăng nhập từ token (sẽ được middleware thêm vào)
        const createdBy = req.user.id; 

        const newResident = await Resident.create({ fullName, apartmentNumber, phoneNumber, createdBy: createdBy, status: status || 'Đang sinh sống' });
        res.status(201).json({ message: 'Tạo hồ sơ cư dân thành công!', resident: newResident });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// US_002 & US_005: Lấy danh sách cư dân (có lọc)
exports.getResidents = async (req, res) => {
    try {
        // Lấy các tiêu chí lọc từ query string (Ví dụ: /api/residents?name=A&status=đang sinh sống)
        const { name, apartment, status } = req.query;
        const filters = { name, apartment, status };
        const residents = await Resident.findAll(filters);
        res.status(200).json(residents);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách cư dân', error: error.message });
    }
};

// US_003: Cập nhật thông tin cư dân
exports.updateResident = async (req, res) => {
    try {
        const { id } = req.params;
        const residentData = req.body;

        // 1. Kiểm tra xem cư dân có tồn tại không
        const existingResident = await Resident.findById(id);
        if (!existingResident) {
            return res.status(404).json({ message: 'Cư dân không tồn tại' });
        }
        // 2. Cập nhật thông tin cư dân
        const affectedRows = await Resident.update(id, residentData);
        if (affectedRows === 0) {
            return res.status(400).json({ message: 'Không có thông tin nào được cập nhật' });
        }
        // 3. Trả về thông tin cư dân đã cập nhật
        const updatedResident = await Resident.findById(id);
        res.status(200).json({ message: 'Cập nhật thông tin cư dân thành công', resident: updatedResident });
    
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin cư dân', error: error.message });
    }
};

// Bổ sung US: Xóa hồ sơ cư dân
exports.deleteResident = async (req, res) => {
    try {
        const { id } = req.params;
        // 1. Kiểm tra xem cư dân có tồn tại không
        const existingResident = await Resident.findById(id);
        if (!existingResident) {
            return res.status(404).json({ message: 'Cư dân không tồn tại' });
        }
        // 2. Xóa hồ sơ cư dân
        await Resident.delete(id);
        res.status(200).json({ message: 'Xóa hồ sơ cư dân thành công', residentId: id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa hồ sơ cư dân', error: error.message });
    }
};