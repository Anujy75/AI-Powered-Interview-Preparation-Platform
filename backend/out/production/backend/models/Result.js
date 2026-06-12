const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true
    },

    // ─── Score ──────────────────────────────────────────────────
    totalQuestions: {
        type: Number,
        required: true
    },
    attempted: {
        type: Number,
        default: 0
    },
    correct: {
        type: Number,
        default: 0
    },
    wrong: {
        type: Number,
        default: 0
    },
    skipped: {
        type: Number,
        default: 0
    },
    score: {
        type: Number, // percentage 0-100
        default: 0
    },
    timeTaken: {
        type: Number, // seconds mein
        default: 0
    },

    // ─── Per Question Breakdown ──────────────────────────────────
    answers: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        selectedOption: {
            type: Number, // user ne kaunsa option choose kiya (0-3), null if skipped
            default: null
        },
        correctOption: {
            type: Number
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        timeTaken: {
            type: Number, // is question pe kitne seconds liye
            default: 0
        }
    }],

    // ─── Performance ────────────────────────────────────────────
    grade: {
        type: String,
        enum: ['A+', 'A', 'B', 'C', 'D', 'F'],
        default: 'F'
    },
    isPassed: {
        type: Boolean,
        default: false // 60% se upar = pass
    },
    categoryBreakdown: [{
        category: String,
        correct: Number,
        total: Number,
        percentage: Number
    }],
    breakdown: [{
        category: String,
        correct: Number,
        total: Number,
        percentage: Number
    }],

    // ─── AI Suggestions ─────────────────────────────────────────
    suggestions: {
        type: [String], // ['Improve JavaScript closures', 'Practice async/await']
        default: []
    },
    aiFeedback: {
        type: String, // Gemini se overall feedback
        default: null
    }

}, {
    timestamps: true
});

// ─── Auto calculate grade before save ───────────────────────
resultSchema.pre('save', function(next) {
    const s = this.score;
    if (s >= 90) this.grade = 'A+';
    else if (s >= 80) this.grade = 'A';
    else if (s >= 70) this.grade = 'B';
    else if (s >= 60) this.grade = 'C';
    else if (s >= 50) this.grade = 'D';
    else this.grade = 'F';

    this.isPassed = s >= 60;
    next();
});

// ─── Index for faster user history queries ───────────────────
resultSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Result', userSchema);