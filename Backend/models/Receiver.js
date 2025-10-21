const mongoose = require('mongoose');
const ReceiverSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    location_lat: Number,
    location_lng: Number,
    verification_status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    family_size: Number,
    needs_description: String,
}, { timestamps: true });
module.exports = mongoose.model('Receiver', ReceiverSchema);