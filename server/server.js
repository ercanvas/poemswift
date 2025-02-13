const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const WebSocketServer = require('./config/websocket');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const battleRoutes = require('./routes/battle');
const validateEnv = require('./config/validateEnv');

// Load env vars
dotenv.config();

// Validate environment variables
validateEnv();

// Initialize Express
const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Initialize WebSocket
new WebSocketServer(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/battle', battleRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
