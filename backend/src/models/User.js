const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'executive'], default: 'user' },
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
