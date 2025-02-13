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

// Remove all existing static and MIME configurations and replace with this:
app.use(express.static('public'));

// Views setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/battle', battleRoutes);

// Simple page routes
app.get('/', (req, res) => res.render('index'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/game', (req, res) => res.render('game'));
app.get('/battle', (req, res) => res.render('battle'));

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
