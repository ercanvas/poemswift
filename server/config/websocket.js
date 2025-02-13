const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Battle = require('../models/Battle');

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.rooms = new Map();
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', async (ws, req) => {
            console.log('New WebSocket connection');

            // Add heartbeat
            ws.isAlive = true;
            ws.on('pong', () => { ws.isAlive = true; });

            // Authentication
            const token = req.url.split('token=')[1];
            if (!token) {
                ws.close(4001, 'Authentication required');
                return;
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                ws.userId = decoded.userId;
            } catch (error) {
                ws.close(4002, 'Invalid token');
                return;
            }

            // Message handling
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.handleMessage(ws, data);
                } catch (error) {
                    this.sendError(ws, 'Invalid message format');
                }
            });

            // Connection close
            ws.on('close', () => {
                this.handleDisconnect(ws);
            });

            // Heartbeat
            ws.isAlive = true;
            ws.on('pong', () => {
                ws.isAlive = true;
            });
        });

        // Add ping interval
        const interval = setInterval(() => {
            this.wss.clients.forEach(ws => {
                if (ws.isAlive === false) return ws.terminate();
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);

        this.wss.on('close', () => {
            clearInterval(interval);
        });
    }

    async handleMessage(ws, data) {
        switch (data.type) {
            case 'JOIN_BATTLE':
                await this.handleJoinBattle(ws, data);
                break;
            case 'SUBMIT_ANSWER':
                await this.handleAnswer(ws, data);
                break;
            case 'LEAVE_BATTLE':
                await this.handleLeaveBattle(ws, data);
                break;
            default:
                this.sendError(ws, 'Unknown message type');
        }
    }

    async handleJoinBattle(ws, data) {
        const { roomId } = data;
        
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }

        const room = this.rooms.get(roomId);
        if (room.size >= 2) {
            this.sendError(ws, 'Room is full');
            return;
        }

        room.add(ws);
        ws.roomId = roomId;

        if (room.size === 2) {
            this.startBattle(roomId);
        } else {
            this.broadcast(roomId, {
                type: 'WAITING_FOR_PLAYERS',
                playersCount: room.size
            });
        }
    }

    startBattle(roomId) {
        const room = this.rooms.get(roomId);
        const question = this.getRandomQuestion();
        
        this.broadcast(roomId, {
            type: 'BATTLE_START',
            question
        });
    }

    broadcast(roomId, message) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        }
    }

    sendError(ws, message) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'ERROR',
                message
            }));
        }
    }

    handleDisconnect(ws) {
        if (ws.roomId && this.rooms.has(ws.roomId)) {
            const room = this.rooms.get(ws.roomId);
            room.delete(ws);
            
            if (room.size === 0) {
                this.rooms.delete(ws.roomId);
            } else {
                this.broadcast(ws.roomId, {
                    type: 'PLAYER_DISCONNECTED',
                    playersCount: room.size
                });
            }
        }
    }
}

module.exports = WebSocketServer;
