// File: backend/models/notificationModel.js
const db = require('../config/db');

const Notification = {
    /**
     * US_015: Tạo thông báo và gửi cho danh sách user ID
     * @param {object} notificationData - { title, content, created_by_user_id }
     * @param {Array<number>} targetUserIds - Mảng các ID của user nhận
     */
    createAndSend: async (notificationData, targetUserIds) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Tạo thông báo chính
            const { title, content, created_by_user_id } = notificationData;
            const [notificationResult] = await connection.query(
                'INSERT INTO notifications (title, content, created_by_user_id) VALUES (?, ?, ?)',
                [title, content, created_by_user_id]
            );
            const notificationId = notificationResult.insertId;

            // 2. Chuẩn bị dữ liệu người nhận (user_id)
            if (targetUserIds && targetUserIds.length > 0) {
                const recipientValues = targetUserIds.map(userId => [notificationId, userId]);
                
                // 3. Chèn tất cả người nhận
                await connection.query(
                    'INSERT INTO notification_recipients (notification_id, user_id) VALUES ?',
                    [recipientValues]
                );
            }

            // 4. Commit transaction
            await connection.commit();
            return { id: notificationId, ...notificationData, recipientsCount: targetUserIds.length };

        } catch (error) {
            await connection.rollback();
            console.error('Lỗi khi tạo thông báo (transaction rolled back):', error);
            throw new Error('Không thể tạo và gửi thông báo.');
        } finally {
            connection.release();
        }
    },

    // Lấy tất cả thông báo đã gửi (cho Admin xem)
    findAll: async () => {
        const [rows] = await db.query(
            `SELECT n.id, n.title, n.created_at, u.full_name as created_by
            FROM notifications n
            JOIN users u ON n.created_by_user_id = u.id
            ORDER BY n.created_at DESC`
        );
        return rows;
    },

    // US_016: Lấy lịch sử thông báo của một user (cư dân)
    findForUser: async (userId) => {
        const [rows] = await db.execute(
            `SELECT n.id, n.title, n.content, n.created_at, nr.status, nr.read_at, u_sender.full_name as sent_by
            FROM notifications n
            JOIN notification_recipients nr ON n.id = nr.notification_id
            JOIN users u_sender ON n.created_by_user_id = u_sender.id
            WHERE nr.user_id = ?
            ORDER BY n.created_at DESC`,
            [userId]
        );
        return rows;
    },

    // US_016: Đánh dấu thông báo đã đọc cho một user
    markAsRead: async (notificationId, userId) => {
        const [result] = await db.execute(
            `UPDATE notification_recipients
            SET status = 'Đã đọc', read_at = CURRENT_TIMESTAMP
            WHERE notification_id = ? AND user_id = ? AND status = 'sent'`,
            [notificationId, userId]
        );
        return result.affectedRows; // Trả về 1 nếu có bản ghi được cập nhật, 0 nếu không tìm thấy hoặc đã đọc rồi
    }
};

module.exports = Notification;