// File: backend/app.js
const express = require('express');
const app = express();
const port = 3000;

// Import routes
const authRoutes = require('./routes/authRoutes');
const residentRoutes = require('./routes/residentRoutes');

// Middleware để đọc JSON từ request body
app.use(express.json());

// Sử dụng các routes
app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes);

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});