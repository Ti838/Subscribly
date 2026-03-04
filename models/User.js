/**
 * models/User.js
 * User model - stores auth info, role, and API key
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Never return password in queries by default
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        // Unique API key generated upon subscription
        apiKey: {
            type: String,
            unique: true,
            sparse: true, // Allows null values (before subscription)
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// ─── Pre-save Hook: Hash password before saving ────────────────────────────
userSchema.pre('save', async function (next) {
    // Only hash if password field was modified
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ─── Instance Method: Compare entered password with hashed one ─────────────
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
