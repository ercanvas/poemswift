const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
    players: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: {
            type: Number,
            default: 0
        },
        ready: {
            type: Boolean,
            default: false
        }
    }],
    status: {
        type: String,
        enum: ['waiting', 'in_progress', 'completed'],
        default: 'waiting'
    },
    currentRound: {
        type: Number,
        default: 0
    },
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Automatically delete after 1 hour
    }
});

module.exports = mongoose.model('Battle', battleSchema);
