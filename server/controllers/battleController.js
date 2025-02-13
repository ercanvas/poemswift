const Battle = require('../models/Battle');
const User = require('../models/User');

const battles = new Map(); // Store active battles in memory

const handleBattleJoin = async (ws, data) => {
    const { userId, roomId } = data;
    
    let battle = await Battle.findOne({ roomId });
    
    if (!battle) {
        battle = new Battle({
            roomId,
            players: [{ userId, ready: true }]
        });
        await battle.save();
    } else if (battle.players.length < 2) {
        battle.players.push({ userId, ready: true });
        await battle.save();
    } else {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Room is full' }));
        return;
    }

    // Store connection
    if (!battles.has(roomId)) {
        battles.set(roomId, new Map());
    }
    battles.get(roomId).set(userId, ws);

    // Check if battle can start
    if (battle.players.length === 2) {
        startBattle(roomId);
    }
};

const startBattle = async (roomId) => {
    const battle = await Battle.findOne({ roomId });
    battle.status = 'in_progress';
    await battle.save();

    const battleRoom = battles.get(roomId);
    const question = getRandomQuestion();

    battleRoom.forEach(ws => {
        ws.send(JSON.stringify({
            type: 'BATTLE_START',
            question
        }));
    });
};

const handleAnswer = async (ws, data) => {
    const { userId, roomId, answer } = data;
    const battle = await Battle.findOne({ roomId });
    
    // Update player score
    const playerIndex = battle.players.findIndex(p => p.userId.toString() === userId);
    if (isCorrectAnswer(answer)) {
        battle.players[playerIndex].score += 100;
        await battle.save();
    }

    // Send update to all players
    const battleRoom = battles.get(roomId);
    battleRoom.forEach(ws => {
        ws.send(JSON.stringify({
            type: 'SCORE_UPDATE',
            scores: battle.players
        }));
    });
};

module.exports = {
    handleBattleJoin,
    handleAnswer,
    battles
};
