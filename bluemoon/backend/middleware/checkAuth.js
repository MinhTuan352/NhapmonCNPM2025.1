// File: backend/middleware/checkAuth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Lấy token từ header, dạng "Bearer <token>"
        const token = req.headers.authorization.split(' ');
        if (!token) {
            return res.status(401).json({ message: 'Yêu cầu xác thực không hợp lệ.' });
        }
        
        // Giải mã token
        const decodedToken = jwt.verify(token, 'YOUR_SECRET_KEY');
        
        // Gắn thông tin user đã giải mã vào request để các controller sau có thể sử dụng
        req.user = { id: decodedToken.id, email: decodedToken.email, role: decodedToken.role };
        
        next(); // Chuyển tiếp đến controller
    } catch (error) {
        res.status(401).json({ message: 'Xác thực thất bại.' });
    }
};