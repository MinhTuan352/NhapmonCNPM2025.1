// File: backend/scripts/hashPassword.js
const bcrypt = require('bcryptjs');

const passwordToHash = 'password123';

async function generateHash() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordToHash, salt);

        console.log('Mật khẩu gốc:', passwordToHash);
        console.log('Mật khẩu đã mã hóa (để copy vào init.sql):');
        console.log(hashedPassword);
    } catch (error) {
        console.error('Lỗi khi mã hóa mật khẩu:', error);
    }
}

generateHash();