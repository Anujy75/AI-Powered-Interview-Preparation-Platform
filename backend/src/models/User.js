const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false  // password kabhi bhi query mein automatically nahi aayega
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
// ─── Ye do fields add karo ────────────────────────────────────
    emailVerifyToken: String,
    emailVerifyExpire: Date,
// ─────────────────────────────────────────────────────────────
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    resume: {
        type: String,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true  // createdAt, updatedAt automatically add hoga
});

// ─── Password Hash karo save se pehle ─────────────────────────
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// ─── Password compare method ───────────────────────────────────
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);