const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true
    },
    options: {
        type: [String],
        validate: {
            validator: function(val) {
                return val.length === 4; // exactly 4 options hone chahiye
            },
            message: 'Question must have exactly 4 options'
        },
        required: true
    },
    correctAnswer: {
        type: Number, // 0, 1, 2, 3 — options array ka index
        required: [true, 'Correct answer is required'],
        min: 0,
        max: 3
    },
    correct: {
        type: Number,
        min: 0,
        max: 3
    },
    explanation: {
        type: String, // answer ke baad explanation dikhayenge
        trim: true,
        default: null
    },
    category: {
        type: String,
        enum: ['frontend', 'backend', 'fullstack', 'devops', 'hr', 'aptitude'],
        required: [true, 'Category is required']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: {
        type: [String], // e.g. ['javascript', 'closures', 'es6']
        default: []
    },
    isActive: {
        type: Boolean,
        default: true // admin deactivate kar sakta hai question ko
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    attempts: {
        type: Number,
        default: 0 // kitni baar ye question attempt hua
    },
    correctAttempts: {
        type: Number,
        default: 0 // kitni baar sahi answer aaya — analytics ke liye
    }
}, {
    timestamps: true
});

// ─── Success rate virtual field ────────────────────────────────
questionSchema.virtual('successRate').get(function() {
    if (this.attempts === 0) return 0;
    return ((this.correctAttempts / this.attempts) * 100).toFixed(1);
});

// ─── Index for faster queries ──────────────────────────────────
questionSchema.index({ category: 1, difficulty: 1, isActive: 1 });

module.exports = mongoose.model('Question', questionSchema);