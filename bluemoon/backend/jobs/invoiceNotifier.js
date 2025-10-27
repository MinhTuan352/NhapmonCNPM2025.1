// backend/jobs/invoiceNotifier.js
const cron = require('node-cron');
const Invoice = require('../models/invoiceModel');
const Notification = require('../models/notificationModel');

console.log('[CronJob] Tác vụ nhắc nợ (invoiceNotifier) đã được khởi tạo.');

// US_013: Tác vụ nhắc nợ hóa đơn hàng ngày (8h sáng)
const startInvoiceReminderJob = () => {
    // Chạy lúc 8:00 sáng hàng ngày
    cron.schedule('0 8 * * *', async () => {
        console.log('[CronJob] Đang chạy tác vụ nhắc nợ (8:00 AM)...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Chuẩn hóa về đầu ngày
            
            const unpaidInvoices = await Invoice.findUnpaidAndOverdue();
            
            for (const invoice of unpaidInvoices) {
                const dueDate = new Date(invoice.due_date);
                const diffTime = dueDate.getTime() - today.getTime();
                const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let title = null;
                let content = null;

                if (daysRemaining < 0 && invoice.status === 'unpaid') {
                    // 1. Quá hạn
                    // Cập nhật trạng thái trong CSDL
                    await Invoice.markAsOverdue(invoice.id);
                    // Gửi thông báo
                    title = `Thông báo quá hạn HĐ #${invoice.id}`;
                    content = `Hóa đơn "${invoice.fee_name}" (tháng ${invoice.month}/${invoice.year}) của bạn đã quá hạn ${-daysRemaining} ngày. Vui lòng thanh toán ngay.`;
                
                } else if (daysRemaining === 1 || daysRemaining === 3 || daysRemaining === 7) {
                    // 2. Sắp đến hạn (7, 3, 1 ngày)
                    title = `Nhắc nợ HĐ #${invoice.id}`;
                    content = `Hóa đơn "${invoice.fee_name}" (tháng ${invoice.month}/${invoice.year}) của bạn sẽ đến hạn sau ${daysRemaining} ngày (vào ngày ${invoice.due_date}). Vui lòng thanh toán sớm.`;
                }

                if (title && content) {
                    // Gửi thông báo "in-app" (trong web)
                    const notificationData = {
                        title: title,
                        content: content,
                        created_by_user_id: 1 // Giả sử ID 1 là "Hệ thống" (hoặc Admin)
                    };
                    const targetUserIds = [invoice.user_id];
                    
                    await Notification.createAndSend(notificationData, targetUserIds);
                    console.log(`[CronJob] Đã gửi nhắc nợ cho user #${invoice.user_id} (HĐ #${invoice.id})`);
                }
            }
            console.log('[CronJob] Tác vụ nhắc nợ hoàn tất.');
        } catch (error) {
            console.error('[CronJob] Lỗi nghiêm trọng khi chạy tác vụ nhắc nợ:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh" // Đảm bảo chạy theo giờ Việt Nam
    });
};

// Bắt đầu job
startInvoiceReminderJob();

// Chúng ta chỉ export hàm (nếu cần)
module.exports = { startInvoiceReminderJob };