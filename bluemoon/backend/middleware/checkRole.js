// File: backend/middleware/checkRole.js
// Middleware này nhận vào một mảng các vai trò được phép
module.exports = (allowedRoles) => {
    return (req, res, next) => {
        // req.user được tạo từ middleware checkAuth
        if (!req.user ||!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này.' });
        }
        next();
    };
};