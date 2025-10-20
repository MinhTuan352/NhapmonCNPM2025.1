// File: backend/middleware/checkAuth.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Kiểm tra xem header 'authorization' có tồn tại không
        if (!req.headers.authorization) {
            throw new Error('Không tìm thấy header Authorization');
        }

        // Lấy token từ header, dạng "Bearer <token>"
        // Tách chuỗi và lấy phần tử thứ hai 
        const token = req.headers.authorization.split(' ')[1]; 
        
        // Giải mã token bằng secret key từ file.env
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn thông tin user đã giải mã vào đối tượng request để các hàm sau có thể sử dụng
        req.user = { 
            id: decodedToken.id, 
            email: decodedToken.email, 
            role: decodedToken.role 
        };
        
        // Nếu mọi thứ hợp lệ, cho phép yêu cầu đi tiếp đến controller
        next(); 
    } catch (error) {
        // Nếu có bất kỳ lỗi nào trong quá trình trên (token thiếu, sai, hết hạn...), trả về lỗi 401
        console.error('Lỗi xác thực trong checkAuth:', error.message); // Thêm log để dễ gỡ lỗi
        res.status(401).json({ message: 'Xác thực thất bại.' });
    }
};