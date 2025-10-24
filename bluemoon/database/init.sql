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
    status VARCHAR(50) NOT NULL DEFAULT 'Đang sinh sống',
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

-- Chèn dữ liệu vai trò ban đầu
INSERT INTO roles (name) VALUES ('Admin'), ('Kế toán'), ('Cư dân'), ('Cơ quan chức năng');

-- Chèn tài khoản Admin test
-- Mật khẩu: password123 (đã hash bằng bcrypt)
INSERT INTO users (username, password, full_name, role_id) 
VALUES ('admin', '$2b$10$ukwGjOqP.ly7YnMCPGTh/O5NcY1Bc5Ye2syWyncT0/ojoL4PM.8oa', 'Admin User', 1);