const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitScore, getLeaderboard } = require('../controllers/gameController');

// Get game stats
router.get('/stats', async (req, res) => {
    try {
        // Implement game stats logic here
        res.json({ message: 'Game stats route' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit score
router.post('/score', auth, submitScore);

router.get('/leaderboard', getLeaderboard);

module.exports = router;
