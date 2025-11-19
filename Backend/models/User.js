const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    donorId: {
        type: String,
        unique: true,
        sparse: true // Allows null values for non-donors without violating unique constraint
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Donor', 'Batch staff', 'Administrator'], 
        required: true 
    },
    phone_number: { type: String },
    total_donations: { type: Number, default: 0 },
    total_amount_donated: { type: Number, default: 0 },
}, { timestamps: true });

// The pre-save hook has been removed as per the new requirements.
// donorId will now be assigned by an admin upon first donation approval.

module.exports = mongoose.model('User', UserSchema);