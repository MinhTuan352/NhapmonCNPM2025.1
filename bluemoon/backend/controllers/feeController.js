// File: backend/controllers/feeController.js
const FeeType = require('../models/feeModel');

// US_011: Kế toán tạo loại phí mới
exports.createFeeType = async (req, res) => {
    try {
        const { name, amount } = req.body;
        if (!name || amount === undefined) {
            return res.status(400).json({ message: 'Tên và Mức phí là bắt buộc.' });
        }
        if (parseFloat(amount) <= 0) {
            return res.status(400).json({ message: 'Mức phí phải lớn hơn 0.' });
        }

        const feeData = { ...req.body, created_by_user_id: req.user.id };
        const feeType = await FeeType.create(feeData);
        res.status(201).json({ message: 'Tạo loại phí thành công.', feeType });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// US_011: Kế toán cập nhật loại phí
exports.updateFeeType = async (req, res) => {
    try {
        const { id } = req.params;
        
        const existingFee = await FeeType.findById(id);
        if (!existingFee) {
            return res.status(404).json({ message: 'Không tìm thấy loại phí này.' });
        }

        const affectedRows = await FeeType.update(id, req.body);
        if (affectedRows === 0) {
            return res.status(400).json({ message: 'Không có thông tin nào được cập nhật.' });
        }
        
        const updatedFee = await FeeType.findById(id);
        res.status(200).json({ message: 'Cập nhật loại phí thành công.', feeType: updatedFee });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// US_011: Kế toán xem danh sách loại phí
exports.getAllFeeTypes = async (req, res) => {
    try {
        const feeTypes = await FeeType.findAll();
        res.status(200).json(feeTypes);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// US_011: Kế toán hủy kích hoạt loại phí
exports.deactivateFeeType = async (req, res) => {
    try {
        const { id } = req.params;
        const existingFee = await FeeType.findById(id);
        if (!existingFee) {
            return res.status(404).json({ message: 'Không tìm thấy loại phí này.' });
        }

        await FeeType.deactivate(id);
        res.status(200).json({ message: 'Hủy kích hoạt loại phí thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};