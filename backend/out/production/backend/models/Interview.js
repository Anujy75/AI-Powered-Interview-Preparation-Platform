const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['mcq', 'ai_mock', 'coding'],
        required: true
    },
    category: {
        type: String,
        enum: ['frontend', 'backend', 'fullstack', 'devops', 'hr', 'aptitude'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    totalQuestions: {
        type: Number,
        required: true
    },
// ─── Ye add karo ───────────────────────────────────────────
    score: {
        type: Number,
        default: 0
    },
// ───────────────────────────────────────────────────────────
    duration: {
        type: Number,
        required: true
    },
    startedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },

    timeTaken: {
        type: Number, // seconds mein
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);