const Score = require('../models/Score');
const User = require('../models/User');

exports.submitScore = async (req, res) => {
    try {
        const { score, correctAnswers, timeSpent } = req.body;
        const userId = req.user.id;

        const newScore = new Score({
            userId,
            score,
            gameMode: 'classic',
            correctAnswers,
            timeSpent
        });

        await newScore.save();

        // Update user's high score if necessary
        await User.findByIdAndUpdate(
            userId,
            { 
                $max: { highScore: score },
                $inc: { gamesPlayed: 1 }
            }
        );

        res.json({ message: 'Score submitted successfully', score: newScore });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting score', error: error.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Score.find()
            .sort({ score: -1 })
            .limit(10)
            .populate('userId', 'username');
        
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
};
