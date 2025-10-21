const express = require('express');
const router = express.Router();
const Receiver = require('../models/Receiver');

// GET /api/receivers/verified - List all verified receivers
router.get('/verified', async (req, res) => {
    try {
    // Use verification_status field to filter verified receivers
    const receivers = await Receiver.find({ verification_status: 'verified' });
        res.json(receivers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newReceiver = new Receiver(req.body);
        const savedReceiver = await newReceiver.save();
        res.status(201).json(savedReceiver);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
