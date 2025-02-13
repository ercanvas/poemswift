const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./server/config/db');
const WebSocketServer = require('./server/config/websocket');
const validateEnv = require('./server/config/validateEnv');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./server/middleware/authMiddleware');

// Route imports
const authRoutes = require('./server/routes/auth');
const gameRoutes = require('./server/routes/game');
const battleRoutes = require('./server/routes/battle');

// Initialize
dotenv.config();
validateEnv();

const app = express();
const server = http.createServer(app);

// Connect DB and WebSocket
connectDB();
new WebSocketServer(server);

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: '*', // Allow all origins for now, change in production
    credentials: true
}));
app.use(express.json());

// Auth middleware for pages
app.use(authMiddleware);

// Serve static files
app.use(express.static('public'));
app.use(express.static('views'));

// Simple routes - serve HTML directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'game.html'));
});

app.get('/battle', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'battle.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/battle', battleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
