-- =============================================================================
-- Database Creation and Selection
-- =============================================================================
CREATE DATABASE IF NOT EXISTS bluemoon_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE bluemoon_db;

-- =============================================================================
-- Table Structure Definitions
-- =============================================================================

-- -----------------------------------------------------
-- Table `roles`
-- Stores user roles (BOD, Accountant, Resident)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID tự tăng của vai trò',
  `role_name` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tên vai trò (e.g., bod, accountance, resident)',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB COMMENT='Lưu trữ các vai trò người dùng trong hệ thống';

-- -----------------------------------------------------
-- Table `users`
-- Stores common login and basic profile information for ALL users
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID tự tăng của người dùng',
  `username` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên đăng nhập unique',
  `password` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã được mã hóa (hashed)',
  `full_name` VARCHAR(150) NOT NULL COMMENT 'Họ và tên đầy đủ',
  `role_id` INT NOT NULL COMMENT 'Khóa ngoại đến bảng roles',
  `email` VARCHAR(150) NULL UNIQUE COMMENT 'Email (có thể null, unique nếu có)',
  `phone` VARCHAR(20) NULL COMMENT 'Số điện thoại (có thể null)',
  `dob` DATE NULL COMMENT 'Ngày sinh (có thể null)',
  `gender` ENUM('Nam', 'Nữ', 'Khác') NULL COMMENT 'Giới tính (có thể null)',
  `cccd` VARCHAR(20) NULL UNIQUE COMMENT 'Số CCCD/CMND (có thể null, unique nếu có)',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Tài khoản có đang hoạt động không?',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo tài khoản',
  PRIMARY KEY (`user_id`),
  INDEX `fk_users_roles_idx` (`role_id` ASC),
  CONSTRAINT `fk_users_roles`
    FOREIGN KEY (`role_id`)
    REFERENCES `roles` (`role_id`)
    ON DELETE RESTRICT -- Không cho xóa Role nếu còn User thuộc Role đó
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Thông tin đăng nhập và cơ bản của tất cả người dùng';

-- -----------------------------------------------------
-- Table `residents`
-- Stores detailed information specific to residents, linked to the `users` table
-- -----------------------------------------------------
DROP TABLE IF EXISTS `residents`;
CREATE TABLE `residents` (
  `user_id` INT NOT NULL COMMENT 'Khóa ngoại / chính đến bảng user',
  `full_name` VARCHAR(150) NOT NULL COMMENT 'Họ tên (lưu trữ lại)',
  `apartment` VARCHAR(50) NOT NULL COMMENT 'Số căn hộ',
  `resident_role` ENUM('owner', 'member') NOT NULL DEFAULT 'member' COMMENT 'Vai trò trong căn hộ (Chủ hộ/Thành viên)',
  `dob` DATE NULL COMMENT 'Ngày sinh (lưu trữ lại)',
  `gender` ENUM('Nam', 'Nữ', 'Khác') NULL COMMENT 'Giới tính (lưu trữ lại)',
  `cccd` VARCHAR(20) NULL UNIQUE COMMENT 'Số CCCD/CMND (lưu trữ lại)',
  `phone` VARCHAR(20) NULL COMMENT 'Số điện thoại (lưu trữ lại)',
  `email` VARCHAR(150) NULL UNIQUE COMMENT 'Email (lưu trữ lại)',
  `status` VARCHAR(100) NULL DEFAULT 'Đang sinh sống' COMMENT 'Tình trạng cư trú',
  `hometown` VARCHAR(255) NULL COMMENT 'Quê quán',
  `occupation` VARCHAR(255) NULL COMMENT 'Nghề nghiệp',
  `username` VARCHAR(100) NULL UNIQUE COMMENT 'Tên đăng nhập (lưu trữ lại, có thể null)',
  `password` VARCHAR(255) NULL COMMENT 'Mật khẩu hash (lưu trữ lại, có thể null)',
  PRIMARY KEY (`user_id`),
  INDEX `idx_resident_apartment` (`apartment` ASC),
  CONSTRAINT `fk_resident_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Thông tin chi tiết dành riêng cho cư dân';

-- -----------------------------------------------------
-- Table `login_history`
-- Tracks user login attempts and details
-- -----------------------------------------------------
DROP TABLE IF EXISTS `login_history`;
CREATE TABLE `login_history` (
  `log_id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID tự tăng của log',
  `user_id` INT NOT NULL COMMENT 'Khóa ngoại đến bảng users',
  `login_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm đăng nhập',
  `ip_address` VARCHAR(45) NULL COMMENT 'Địa chỉ IP đăng nhập',
  `user_agent` TEXT NULL COMMENT 'Thông tin trình duyệt và hệ điều hành',
  PRIMARY KEY (`log_id`),
  INDEX `fk_login_history_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_login_history_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE -- Nếu xóa user thì xóa cả lịch sử đăng nhập
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Lịch sử các lần đăng nhập của người dùng';

-- -----------------------------------------------------
-- Table `fee_types`
-- Manages different types of fees (Management, Parking, Water, etc.)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fee_types`;
CREATE TABLE `fee_types` (
  `fee_type_id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID tự tăng của loại phí',
  `name` VARCHAR(150) NOT NULL COMMENT 'Tên loại phí (vd: Phí Quản lý)',
  `description` TEXT NULL COMMENT 'Mô tả chi tiết về loại phí',
  `amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Mức phí cơ bản (nếu cách tính là fixed)',
  `unit` VARCHAR(50) NULL COMMENT 'Đơn vị tính (vd: m², xe/tháng, hộ/tháng, kWh, m³)',
  `calculation_method` ENUM('fixed', 'area', 'usage', 'manual') NOT NULL DEFAULT 'fixed' COMMENT 'Phương pháp tính phí',
  `created_by_user_id` INT NULL COMMENT 'ID người dùng (accountant) tạo loại phí này',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Loại phí này có còn đang áp dụng không?',
  PRIMARY KEY (`fee_type_id`),
  INDEX `fk_fee_types_users_idx` (`created_by_user_id` ASC),
  CONSTRAINT `fk_fee_types_users`
    FOREIGN KEY (`created_by_user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE SET NULL -- Nếu xóa user tạo thì giữ lại loại phí nhưng không biết ai tạo
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Quản lý các loại phí dịch vụ của chung cư';

-- -----------------------------------------------------
-- Table `invoices` (Previously requested as `fee`)
-- Stores individual fee invoices for residents
-- -----------------------------------------------------
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `invoice_id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID tự tăng của hóa đơn',
  `user_id` INT NOT NULL COMMENT 'ID Cư dân nhận hóa đơn (khóa ngoại users)',
  `fee_type_id` INT NOT NULL COMMENT 'ID Loại phí áp dụng (khóa ngoại fee_types)',
  `description` TEXT NULL COMMENT 'Nội dung chi tiết hóa đơn (vd: PQL T10/2025)',
  `billing_period` VARCHAR(20) NULL COMMENT 'Kỳ thanh toán (vd: T10/2025)',
  `issue_date` DATE NOT NULL COMMENT 'Ngày lập hóa đơn',
  `due_date` DATE NOT NULL COMMENT 'Hạn cuối thanh toán',
  `total_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng số tiền phải thanh toán',
  `amount_paid` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Số tiền đã thanh toán',
  `amount_remaining` DECIMAL(15,2) GENERATED ALWAYS AS (`total_amount` - `amount_paid`) STORED COMMENT 'Số tiền còn nợ (tự động tính)',
  `status` ENUM('Chưa thanh toán', 'Đã thanh toán', 'Quá hạn', 'Đã hủy') NOT NULL DEFAULT 'Chưa thanh toán' COMMENT 'Trạng thái hóa đơn',
  `payment_date` DATETIME NULL COMMENT 'Ngày thanh toán hoàn tất',
  `payment_method` VARCHAR(100) NULL COMMENT 'Phương thức thanh toán',
  `transaction_id` VARCHAR(255) NULL COMMENT 'Mã giao dịch thanh toán (nếu có)',
  `created_by_user_id` INT NULL COMMENT 'ID người dùng (accountant) tạo hóa đơn',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo hóa đơn',
  PRIMARY KEY (`invoice_id`),
  INDEX `fk_invoices_users_idx` (`user_id` ASC),
  INDEX `fk_invoices_fee_types_idx` (`fee_type_id` ASC),
  INDEX `fk_invoices_creator_idx` (`created_by_user_id` ASC),
  INDEX `idx_invoices_status_due_date` (`status` ASC, `due_date` ASC) COMMENT 'Index cho việc truy vấn hóa đơn theo trạng thái và hạn TT',
  CONSTRAINT `fk_invoices_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE RESTRICT -- Không cho xóa User nếu còn hóa đơn
    ON UPDATE CASCADE,
  CONSTRAINT `fk_invoices_fee_types`
    FOREIGN KEY (`fee_type_id`)
    REFERENCES `fee_types` (`fee_type_id`)
    ON DELETE RESTRICT -- Không cho xóa Loại phí nếu còn hóa đơn dùng nó
    ON UPDATE CASCADE,
  CONSTRAINT `fk_invoices_creator`
    FOREIGN KEY (`created_by_user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE SET NULL -- Nếu xóa user tạo thì không biết ai tạo
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Lưu trữ hóa đơn phí dịch vụ của cư dân';

-- -----------------------------------------------------
-- Table `notifications`
-- Stores the content of notifications sent
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `noti_id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID tự tăng của thông báo',
  `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề thông báo',
  `content` TEXT NOT NULL COMMENT 'Nội dung chi tiết',
  `type` VARCHAR(50) NULL DEFAULT 'Chung' COMMENT 'Loại thông báo (Chung, Thu phí, Khẩn cấp, etc.)',
  `created_by_user_id` INT NOT NULL COMMENT 'ID người dùng (BOD) gửi thông báo',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo thông báo',
  `scheduled_at` DATETIME NULL COMMENT 'Thời gian dự kiến gửi đi (nếu có)',
  `attachments` TEXT NULL COMMENT 'Lưu trữ thông tin file đính kèm (vd: JSON array of URLs/paths)',
  PRIMARY KEY (`noti_id`),
  INDEX `fk_notifications_users_idx` (`created_by_user_id` ASC),
  CONSTRAINT `fk_notifications_users`
    FOREIGN KEY (`created_by_user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE RESTRICT -- Không cho xóa User nếu họ đã gửi thông báo
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Nội dung chính của các thông báo được gửi đi';

-- -----------------------------------------------------
-- Table `notification_recipients`
-- Links notifications to their recipients and tracks read status
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notification_recipients`;
CREATE TABLE `notification_recipients` (
  `recipient_id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID tự tăng',
  `noti_id` INT NOT NULL COMMENT 'Khóa ngoại đến bảng notifications',
  `user_id` INT NOT NULL COMMENT 'ID Người dùng nhận thông báo',
  `status` ENUM('sent', 'read') NOT NULL DEFAULT 'sent' COMMENT 'Trạng thái (Đã gửi, Đã đọc)',
  `read_at` DATETIME NULL COMMENT 'Thời gian người dùng đọc thông báo',
  PRIMARY KEY (`recipient_id`),
  INDEX `fk_recipients_notifications_idx` (`noti_id` ASC),
  INDEX `fk_recipients_users_idx` (`user_id` ASC),
  UNIQUE INDEX `unique_notification_recipient` (`noti_id` ASC, `user_id` ASC) COMMENT 'Đảm bảo mỗi user chỉ nhận 1 thông báo 1 lần',
  CONSTRAINT `fk_recipients_notifications`
    FOREIGN KEY (`noti_id`)
    REFERENCES `notifications` (`noti_id`)
    ON DELETE CASCADE -- Nếu xóa thông báo gốc thì xóa các record nhận
    ON UPDATE CASCADE,
  CONSTRAINT `fk_recipients_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE -- Nếu xóa user thì xóa các record nhận của họ
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Danh sách người nhận cho mỗi thông báo và trạng thái đọc';

-- -----------------------------------------------------
-- Table `incidents` (Previously requested as `report`)
-- Stores incident reports submitted by residents
-- -----------------------------------------------------
DROP TABLE IF EXISTS `incidents`;
CREATE TABLE `incidents` (
  `incident_id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID tự tăng của sự cố',
  `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề ngắn gọn của sự cố',
  `description` TEXT NOT NULL COMMENT 'Mô tả chi tiết sự cố',
  `location` VARCHAR(255) NULL COMMENT 'Vị trí cụ thể xảy ra sự cố',
  `status` ENUM('Mới', 'Đang xử lý', 'Hoàn thành', 'Đã hủy') NOT NULL DEFAULT 'Mới' COMMENT 'Trạng thái xử lý sự cố',
  `reported_by_user_id` INT NOT NULL COMMENT 'ID Cư dân báo cáo sự cố',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian báo cáo sự cố',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật trạng thái lần cuối',
  `assigned_to_user_id` INT NULL COMMENT 'ID Nhân viên (BOD) được giao xử lý',
  `internal_notes` TEXT NULL COMMENT 'Ghi chú nội bộ của BQL về quá trình xử lý',
  PRIMARY KEY (`incident_id`),
  INDEX `fk_incidents_reporter_idx` (`reported_by_user_id` ASC),
  INDEX `fk_incidents_assignee_idx` (`assigned_to_user_id` ASC),
  INDEX `idx_incidents_status` (`status` ASC),
  CONSTRAINT `fk_incidents_reporter`
    FOREIGN KEY (`reported_by_user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE RESTRICT -- Không xóa user nếu họ đã báo cáo sự cố
    ON UPDATE CASCADE,
  CONSTRAINT `fk_incidents_assignee`
    FOREIGN KEY (`assigned_to_user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE SET NULL -- Nếu xóa user xử lý thì đặt lại là NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Lưu trữ các báo cáo sự cố từ cư dân';

-- =============================================================================
-- Insert Initial Data (Roles, Sample Users, etc.)
-- =============================================================================

-- Add Roles
INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'bod'),
(2, 'accountance'),
(3, 'resident')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name); -- Update if exists

-- Add Sample Admin/Accountant Users (Password: password123)
-- Hash: $2a$10$E.ew4/3.pC5aP1yrfmg3U.u8.Jqd.fzJb4FEoYLpG2LhL5j81vx7O
INSERT INTO `users` (`username`, `password`, `full_name`, `role_id`, `email`, `phone`, `dob`, `gender`, `cccd`) VALUES
('bod.admin1', '$2a$10$E.ew4/3.pC5aP1yrfmg3U.u8.Jqd.fzJb4FEoYLpG2LhL5j81vx7O', 'Nguyễn Văn Admin 1', 1, 'admin1@bluemoon.com', '0910000001', '1985-01-15', 'Nam', '001085000001'),
('acc.ketoan1', '$2a$10$E.ew4/3.pC5aP1yrfmg3U.u8.Jqd.fzJb4FEoYLpG2LhL5j81vx7O', 'Lê Văn Kế Toán 1', 2, 'ketoan1@bluemoon.com', '0920000001', '1990-07-10', 'Nam', '001090000001')
-- Add more admin/accountant users here (up to 10 total) ...
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name); -- Prevent errors if run again

-- Add Sample Resident Users (Password: password123)
-- Apartment A101
INSERT INTO `users` (`username`, `password`, `full_name`, `role_id`, `email`, `phone`, `dob`, `gender`, `cccd`) VALUES
('a101.owner', '$2a$10$E.ew4/3.pC5aP1yrfmg3U.u8.Jqd.fzJb4FEoYLpG2LhL5j81vx7O', 'Trần Văn Hộ A101', 3, 'a101.owner@bluemoon.com', '0930000101', '1980-05-10', 'Nam', '001180000101');
SET @a101_owner_id = LAST_INSERT_ID();
INSERT INTO `residents` (`user_id`, `apartment`, `resident_role`, `status`, `hometown`, `occupation`) VALUES (@a101_owner_id, 'A101', 'owner', 'Đang sinh sống', 'Hà Nội', 'Kỹ sư') ON DUPLICATE KEY UPDATE apartment=VALUES(apartment);

INSERT INTO `users` (`username`, `password`, `full_name`, `role_id`, `email`, `phone`, `dob`, `gender`, `cccd`) VALUES
(NULL, NULL, 'Nguyễn Thị Vợ A101', 3, 'a101.mem1@bluemoon.com', '0930001101', '1982-08-15', 'Nữ', '001182000101');
SET @a101_mem1_id = LAST_INSERT_ID();
INSERT INTO `residents` (`user_id`, `apartment`, `resident_role`) VALUES (@a101_mem1_id, 'A101', 'member') ON DUPLICATE KEY UPDATE apartment=VALUES(apartment);

-- Apartment B205
INSERT INTO `users` (`username`, `password`, `full_name`, `role_id`, `email`, `phone`, `dob`, `gender`, `cccd`) VALUES
('b205.owner', '$2a$10$E.ew4/3.pC5aP1yrfmg3U.u8.Jqd.fzJb4FEoYLpG2LhL5j81vx7O', 'Lê Gia Đình B205', 3, 'b205.owner@bluemoon.com', '0930000205', '1975-11-20', 'Nam', '001175000205');
SET @b205_owner_id = LAST_INSERT_ID();
INSERT INTO `residents` (`user_id`, `apartment`, `resident_role`, `occupation`) VALUES (@b205_owner_id, 'B205', 'owner', 'Kinh doanh') ON DUPLICATE KEY UPDATE apartment=VALUES(apartment);

INSERT INTO `users` (`username`, `password`, `full_name`, `role_id`, `phone`) VALUES
(NULL, NULL, 'Phạm Thị Mẹ B205', 3, '0930001205');
SET @b205_mem1_id = LAST_INSERT_ID();
INSERT INTO `residents` (`user_id`, `apartment`, `resident_role`) VALUES (@b205_mem1_id, 'B205', 'member') ON DUPLICATE KEY UPDATE apartment=VALUES(apartment);

-- (Add 8 more apartments with 2-6 members each following the pattern above...)

-- Add Sample Fee Types
SET @acc_ketoan1_id = (SELECT user_id FROM users WHERE username = 'acc.ketoan1' LIMIT 1);
INSERT INTO `fee_types` (`name`, `description`, `amount`, `unit`, `calculation_method`, `created_by_user_id`) VALUES
('Phí Quản lý', 'Thu hàng tháng dựa trên diện tích', 15000, 'm²', 'area', @acc_ketoan1_id),
('Phí Gửi xe Ô tô', 'Thu cố định hàng tháng cho mỗi xe ô tô', 1000000, 'xe/tháng', 'fixed', @acc_ketoan1_id),
('Phí Gửi xe Máy', 'Thu cố định hàng tháng cho mỗi xe máy', 100000, 'xe/tháng', 'fixed', @acc_ketoan1_id),
('Phí Nước Sinh Hoạt', 'Thu theo chỉ số đồng hồ nước', 12000, 'm³', 'usage', @acc_ketoan1_id)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Add Sample Invoices
SET @fee_type_pql = (SELECT fee_type_id FROM fee_types WHERE name = 'Phí Quản lý' LIMIT 1);
SET @fee_type_xeoto = (SELECT fee_type_id FROM fee_types WHERE name = 'Phí Gửi xe Ô tô' LIMIT 1);
SET @a101_owner_id = (SELECT user_id FROM residents WHERE apartment = 'A101' AND resident_role = 'owner' LIMIT 1);
SET @b205_owner_id = (SELECT user_id FROM residents WHERE apartment = 'B205' AND resident_role = 'owner' LIMIT 1);

INSERT INTO `invoices` (`user_id`, `fee_type_id`, `description`, `billing_period`, `issue_date`, `due_date`, `total_amount`, `amount_paid`, `status`, `payment_date`, `created_by_user_id`) VALUES
(@a101_owner_id, @fee_type_pql, 'PQL Tháng 10/2025', 'T10/2025', '2025-10-01', '2025-10-15', 1200000, 1200000, 'Đã thanh toán', '2025-10-10 09:30:00', @acc_ketoan1_id),
(@a101_owner_id, @fee_type_xeoto, 'Xe ô tô BKS 29A-12345 T10/2025', 'T10/2025', '2025-10-01', '2025-10-15', 1000000, 0, 'Chưa thanh toán', NULL, @acc_ketoan1_id),
(@b205_owner_id, @fee_type_pql, 'PQL Tháng 09/2025', 'T09/2025', '2025-09-01', '2025-09-15', 1500000, 0, 'Quá hạn', NULL, @acc_ketoan1_id);
-- Add more sample invoices...

-- Add Sample Notification and Recipients
SET @bod_admin1_id = (SELECT user_id FROM users WHERE username = 'bod.admin1' LIMIT 1);
INSERT INTO `notifications` (`title`, `content`, `type`, `created_by_user_id`) VALUES
('Thông báo lịch cắt điện Tòa A', 'Do sự cố đột xuất tại trạm biến áp, Tòa A sẽ tạm ngưng cung cấp điện từ 14:00 đến 15:00 ngày 29/10/2025 để khắc phục.', 'Khẩn cấp', @bod_admin1_id);
SET @noti1_id = LAST_INSERT_ID();
-- Send to all residents (role_id = 3)
INSERT IGNORE INTO `notification_recipients` (`noti_id`, `user_id`) SELECT @noti1_id, `user_id` FROM `users` WHERE `role_id` = 3;

-- Add Sample Incidents
INSERT INTO `incidents` (`title`, `description`, `location`, `reported_by_user_id`, `status`) VALUES
('Vỡ ống nước khu vực hầm B2', 'Nước chảy thành dòng lớn ở hầm B2, khu vực cột 15.', 'Hầm B2, cột 15', @a101_owner_id, 'Mới'),
('Thang máy sảnh B báo lỗi', 'Thang máy sảnh B dừng đột ngột và báo lỗi DOOR_ERR.', 'Thang máy B, Tòa B', @b205_owner_id, 'Đang xử lý');

-- =============================================================================
-- End of Script
-- =============================================================================