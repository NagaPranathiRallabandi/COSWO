const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
// You'll need an auth middleware to get the logged-in user
// const auth = require('../middleware/auth'); 

// For now, let's assume 'req.user.email' is available
// from a JWT authentication middleware.

// POST /api/donations - Create a new donation
// This replaces your 'createDonation' workflow
router.post('/', async (req, res) => {
    console.log('[POST /api/donations] incoming body:', req.body);
    try {
        const userEmail = "testuser@example.com"; // In reality: req.user.email;
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(400).json({ msg: 'User profile not found.' });
        }

        const newDonation = new Donation({
            ...req.body,
            donor_email: userEmail,
            donor_id: user._id, // Use the user's main ID
        });

        const savedDonation = await newDonation.save();
        console.log('[POST /api/donations] saved donation id:', savedDonation._id);

        // Update user stats
        await User.findByIdAndUpdate(user._id, {
            $inc: { total_donations: 1, total_amount_donated: savedDonation.amount || 0 }
        });

        res.status(201).json(savedDonation);
    } catch (err) {
        console.error('[POST /api/donations] error:', err);
        res.status(500).json({ error: err.message });
    }
});


// GET /api/donations - List all donations
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find();
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;