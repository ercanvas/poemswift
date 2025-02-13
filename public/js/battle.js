class BattleGame {
    constructor() {
        this.ws = new WebSocket(`ws://${window.location.hostname}:5000`);
        this.roomId = null;
        this.userId = localStorage.getItem('userId');
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch(data.type) {
                case 'BATTLE_START':
                    this.handleBattleStart(data);
                    break;
                case 'SCORE_UPDATE':
                    this.updateScores(data.scores);
                    break;
                case 'ERROR':
                    this.showError(data.message);
                    break;
            }
        };
    }

    joinBattle(roomId) {
        this.roomId = roomId;
        this.ws.send(JSON.stringify({
            type: 'JOIN_BATTLE',
            userId: this.userId,
            roomId
        }));
    }

    submitAnswer(answer) {
        this.ws.send(JSON.stringify({
            type: 'SUBMIT_ANSWER',
            userId: this.userId,
            roomId: this.roomId,
            answer
        }));
    }

    handleBattleStart(data) {
        document.getElementById('waiting-screen').classList.add('hidden');
        document.getElementById('battle-container').classList.remove('hidden');
        this.loadQuestion(data.question);
    }

    updateScores(scores) {
        const scoreboardElement = document.getElementById('battle-scoreboard');
        scoreboardElement.innerHTML = scores.map(player => `
            <div class="score-item">
                <span class="player-name">${player.userId}</span>
                <span class="player-score">${player.score}</span>
            </div>
        `).join('');
    }

    showError(message) {
        alert(message);
    }
}

// Initialize battle
const battle = new BattleGame();
