const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./server/config/db');
const WebSocketServer = require('./server/config/websocket');
const validateEnv = require('./server/config/validateEnv');

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
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://poemswift.onrender.com' 
        : 'http://localhost:5000',
    credentials: true
}));
app.use(express.json());

// Static & Views
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/battle', battleRoutes);

// Page Routes
app.get('/', (req, res) => res.render('index'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/game', (req, res) => res.render('game'));
app.get('/battle', (req, res) => res.render('battle'));

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
