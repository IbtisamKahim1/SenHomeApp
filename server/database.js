const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now } // Automatically adds timestamp
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
