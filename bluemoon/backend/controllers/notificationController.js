// File: backend/controllers/notificationController.js
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

// US_015: Soạn và gửi thông báo
exports.createNotification = async (req, res) => {
  try {
    // target: { type: 'all_residents' } hoặc { type: 'specific_users', ids: [1, 2, 3] }
    const { title, content, target } = req.body; 
    const created_by_user_id = req.user.id; 

    if (!title || !content || !target || !target.type) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đủ Tiêu đề, Nội dung và Đối tượng gửi.' });
    }

    let targetUserIds = [];

    // 1. Xác định ID của các user sẽ nhận thông báo
    if (target.type === 'all_residents') {
      // Lấy tất cả user có vai trò 'Cư dân'
      targetUserIds = await User.findAllByRole('Cư dân');
    } else if (target.type === 'specific_users') {
      if (!target.ids || !Array.isArray(target.ids) || target.ids.length === 0) {
        return res.status(400).json({ message: 'Vui lòng cung cấp danh sách user ID cụ thể.' });
      }
      targetUserIds = target.ids; // Đây là mảng các user_id
    } else {
      return res.status(400).json({ message: 'Loại đối tượng không hợp lệ.' });
    }

    if (targetUserIds.length === 0) {
      return res.status(400).json({ message: 'Không tìm thấy tài khoản "Cư dân" nào để gửi thông báo.' });
    }

    // 2. Gói dữ liệu và gọi Model để thực hiện
    const notificationData = { title, content, created_by_user_id };
    const notification = await Notification.createAndSend(notificationData, targetUserIds);

    res.status(201).json({ message: 'Gửi thông báo thành công.', notification });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi gửi thông báo', error: error.message });
  }
};

// Lấy danh sách tất cả thông báo đã gửi (cho Admin)
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách thông báo', error: error.message });
    }
};

// US_016: Cư dân lấy lịch sử thông báo của mình
exports.getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.findForUser(userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy lịch sử thông báo của bạn', error: error.message });
    }
};

// US_016: Cư dân đánh dấu thông báo đã đọc
exports.markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        const affectedRows = await Notification.markAsRead(id, userId);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông báo hoặc thông báo đã được đánh dấu là đã đọc.' });
        }

        res.status(200).json({ message: 'Đã đánh dấu thông báo là đã đọc.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi đánh dấu thông báo là đã đọc', error: error.message });
    }
};