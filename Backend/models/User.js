const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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

module.exports = mongoose.model('User', UserSchema);