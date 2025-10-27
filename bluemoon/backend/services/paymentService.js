// File: backend/services/paymentService.js
// Giả lập một cổng thanh toán như MoMo hay VNPay

/**
 * US_012: Giả lập tạo URL thanh toán
 * @returns {object} { paymentUrl, transactionCode }
 */
const createPaymentUrl = (invoiceId, amount, returnUrl) => {
    console.log(`[PaymentService] Yêu cầu tạo link thanh toán cho hóa đơn #${invoiceId}, số tiền ${amount}`);
    
    // Tạo một mã giao dịch giả
    const transactionCode = `BLUEMOON_${Date.now()}`;
    
    // Tạo URL giả của cổng thanh toán
    // (Trong thực tế, URL này sẽ trỏ về trang frontend của bạn)
    const paymentUrl = `${returnUrl}?invoice_id=${invoiceId}&amount=${amount}&trans_code=${transactionCode}&status=success`;
    
    console.log(`[PaymentService] Tạo link thành công: ${paymentUrl}`);
    return { paymentUrl, transactionCode };
};

module.exports = { createPaymentUrl };