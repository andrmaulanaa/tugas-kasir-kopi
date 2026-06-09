require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const authRoute = require('./routes/authRoute');
const orderRoute = require('./routes/orderRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/orders', orderRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Koneksi Database (Dioptimalkan untuk Lingkungan Serverless Vercel)
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log('✅ MongoDB Connected for Coffee Shop System');
    if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
            console.log(`🚀 Cashier Server running on port ${PORT}`);
        });
    }
}).catch(err => console.error('❌ Database connection error:', err));

module.exports = app;