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

// Prefix API untuk rute kasir kopi
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/orders', orderRoute);

// Monolithic UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Koneksi Database
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
}).then(() => {
    console.log('✅ MongoDB Connected for Coffee Shop System');
    app.listen(PORT, () => {
        console.log(`🚀 Cashier Server running on port ${PORT}`);
    });
}).catch(err => console.error('❌ Database connection error:', err));