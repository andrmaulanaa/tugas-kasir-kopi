const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

const router = express.Router();

// Fungsi "Satpam" Pengecek Token Bearer
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: "Access Denied. No token provided." });

    const token = authHeader.split(" ")[1]; // Mengambil token setelah kata "Bearer "
    if (!token) return res.status(401).json({ error: "Access Denied. Invalid token format." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

// CREATE: Input Pesanan Kopi Baru
router.post('/', verifyToken, async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ error: "Failed to create order." });
    }
});

// READ: Ambil Semua Data Pesanan
router.get('/', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); // Tampilkan dari yang paling baru
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders." });
    }
});

// UPDATE: Ubah Status Pembayaran (Misal dari Unpaid jadi Paid)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: "Failed to update order." });
    }
});

// DELETE: Hapus Pesanan
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete order." });
    }
});

module.exports = router;