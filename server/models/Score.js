const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: { type: Number, required: true },
    gameMode: { type: String, enum: ['classic', 'battle'], required: true },
    correctAnswers: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);
