const mongoose = require('mongoose');
const DonationSchema = new mongoose.Schema({
    donor_email: { type: String, required: true },
    donor_id: { type: String, required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Receiver', required: true },
    donation_type: String,
    amount: Number,
    items: [{ name: String, quantity: Number, category: String }],
    status: { type: String, enum: ['pending', 'in_transit', 'delivered', 'confirmed'], default: 'pending' },
    delivery_notes: String,
    scheduled_delivery: Date,
    actual_delivery: Date,
    proof_sent: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Donation', DonationSchema);