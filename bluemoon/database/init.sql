-- File: database/init.sql

-- Bảng lưu các vai trò trong hệ thống (US_020)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Bảng lưu thông tin tài khoản người dùng (US_020, US_021)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Sẽ lưu mật khẩu đã được mã hóa
    full_name VARCHAR(255),
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Bảng lưu thông tin cư dân (US_001)
CREATE TABLE IF NOT EXISTS residents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    apartment_number VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    created_by INT, -- ID của người dùng Admin đã tạo hồ sơ này
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Bảng lưu lịch sử đăng nhập (US_021)
CREATE TABLE IF NOT EXISTS login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bảng lưu nội dung các thông báo (US_015)
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by_user_id INT, -- ID của Admin/BQT đã soạn thông báo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

-- Bảng theo dõi thông báo được gửi đến ai (US_015)
CREATE TABLE IF NOT EXISTS notification_recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('sent', 'read') NOT NULL DEFAULT 'sent',
    read_at TIMESTAMP NULL,
    UNIQUE KEY (notification_id, user_id), -- Đảm bảo 1 cư dân chỉ nhận 1 thông báo 1 lần
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng lưu các phản ánh sự cố (US_017)
CREATE TABLE IF NOT EXISTS incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255), -- Vị trí (VD: "Hành lang tầng 10", "Thang máy sảnh B")
    status ENUM('submitted', 'in_progress', 'resolved') NOT NULL DEFAULT 'submitted',
    reported_by_user_id INT NOT NULL, -- ID của User "Cư dân" đã gửi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_by_user_id) REFERENCES users(id)
);

-- Bảng lưu các loại phí (US_011)
CREATE TABLE IF NOT EXISTS fee_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- "Phí quản lý", "Phí gửi xe máy"
    description TEXT,
    amount DECIMAL(15, 2) NOT NULL, -- Giá tiền (hỗ trợ số lớn)
    unit VARCHAR(50), -- "VND/m2/tháng", "VND/xe/tháng", "VND/khối"
    is_active BOOLEAN DEFAULT true, -- Dùng để "hủy" hoặc tạm ngưng
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_user_id INT, -- ID của Kế toán/Admin đã tạo
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

-- Bảng lưu các hóa đơn cho từng Cư dân (US_012)
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- User "Cư dân" phải trả
    fee_type_id INT NOT NULL, -- Liên kết với loại phí
    amount DECIMAL(15, 2) NOT NULL, -- Số tiền (có thể tùy chỉnh)
    month INT NOT NULL, -- Hóa đơn cho tháng
    year INT NOT NULL, -- Hóa đơn cho năm
    issue_date DATE NOT NULL, -- Ngày phát hành HĐ
    due_date DATE NOT NULL, -- Hạn chót
    status ENUM('unpaid', 'paid', 'overdue', 'cancelled') NOT NULL DEFAULT 'unpaid',
    payment_method VARCHAR(50) NULL,
    transaction_id VARCHAR(255) NULL, -- Mã giao dịch từ cổng thanh toán
    paid_at TIMESTAMP NULL,
    created_by_user_id INT, -- Kế toán đã tạo
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fee_type_id) REFERENCES fee_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

-- Bảng lưu lịch sử chi tiết các giao dịch (US_012)
-- (Tách riêng để một hóa đơn có thể được thanh toán nhiều lần)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_code VARCHAR(255) NOT NULL, -- Mã từ cổng thanh toán
    status ENUM('success', 'failed', 'pending') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- Chèn dữ liệu vai trò ban đầu
INSERT INTO roles (name) VALUES ('bod'), ('accountance'), ('resident');

-- Chèn tài khoản Admin test
-- Mật khẩu: password123 (đã hash bằng bcrypt)
INSERT INTO users (username, password, full_name, role_id) 
VALUES ('admin', '$2b$10$ukwGjOqP.ly7YnMCPGTh/O5NcY1Bc5Ye2syWyncT0/ojoL4PM.8oa', 'Admin User', 1);