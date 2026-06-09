const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// Rute Pendaftaran Akun Kasir Baru
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to register account." });
    }
});

// Rute Login Kasir
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ error: "Invalid username or password" });

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid username or password" });

        // Membuat Token Rahasia
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.header('Authorization', `Bearer ${token}`).json({ token, message: "Login successful!" });
    } catch (err) {
        res.status(500).json({ error: "Server error during login." });
    }
});

module.exports = router;