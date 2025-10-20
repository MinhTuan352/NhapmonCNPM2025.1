-- File: database/init.sql

-- Bảng lưu các vai trò trong hệ thống (US_020)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- 'Admin', 'Kế toán', 'Cư dân'
);

-- Bảng lưu thông tin tài khoản người dùng (US_020, US_021)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
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
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Chèn dữ liệu vai trò ban đầu
INSERT INTO roles (name) VALUES ('Admin'), ('Kế toán'), ('Cư dân');

-- Chèn tài khoản Admin test
-- Mật khẩu: password123 (đã hash bằng bcrypt)
INSERT INTO users (email, password, full_name, role_id) 
VALUES ('admin@bluemoon.com', '$2b$10$ukwGjOqP.ly7YnMCPGTh/O5NcY1Bc5Ye2syWyncT0/ojoL4PM.8oa', 'Admin User', 1);