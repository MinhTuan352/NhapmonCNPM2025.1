// File: backend/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Import routes
const authRoutes = require('./routes/authRoutes');
const residentRoutes = require('./routes/residentRoutes');

// Middleware để đọc JSON từ request body
app.use(cors());
app.use(express.json());

// Sử dụng các routes
app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes);

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});