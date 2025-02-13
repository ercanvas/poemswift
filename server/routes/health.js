const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        res.json({
            status: 'ok',
            timestamp: new Date(),
            dbStatus: dbState === 1 ? 'connected' : 'disconnected'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
