const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
const auth = require('../middleware/auth'); // Assuming auth middleware sets req.user

// @route   POST /api/donations
// @desc    Create a new donation for approval
// @access  Private (Donor)
router.post('/', auth, async (req, res) => {
    try {
        // The user's ID is retrieved from the authentication token
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'Donor') {
            return res.status(403).json({ msg: 'User is not a donor or not found.' });
        }

        // Create the new donation with a 'pending_approval' status
        const newDonation = new Donation({
            ...req.body,
            donor: user._id, // Link to the User document
            status: 'pending_approval' // Default status for new donations
        });

        const savedDonation = await newDonation.save();

        // Note: We do NOT update donor stats (total_donations, etc.) here.
        // That will happen upon admin approval.

        res.status(201).json({ 
            message: 'Donation submitted for approval.',
            donation: savedDonation 
        });

    } catch (err) {
        console.error('Error creating donation:', err.message);
        res.status(500).json({ error: 'Server error while creating donation.' });
    }
});

// @route   GET /api/donations
// @desc    Get all donations for the logged-in donor
// @access  Private (Donor)
router.get('/', auth, async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 });
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;