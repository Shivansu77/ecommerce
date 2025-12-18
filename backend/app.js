require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

const connectDB = require('./src/config/db');

// Database Connection
connectDB();

// Routes
const auth = require('./src/routes/authRoutes');
const products = require('./src/routes/productRoutes');
const payment = require('./src/routes/paymentRoutes');
const admin = require('./src/routes/adminRoutes');

app.use('/api/v1/auth', auth);
app.use('/api/v1/products', products);
app.use('/api/v1/payment', payment);
app.use('/api/v1/admin', admin);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Create Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;