// Initialize game state
let gameStarted = false;

// Initialize UI elements conditionally
document.addEventListener('DOMContentLoaded', () => {
    // Menu toggle initialization
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }

    // Start game button initialization
    const startButton = document.getElementById('start-game');
    if (startButton) {
        startButton.addEventListener('click', () => {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('game-container').classList.remove('hidden');
            gameStarted = true;
            currentLevel = 0;
            score = 0;
            lives = 3;
            loadLevel();
        });
    }

    // Play again button initialization
    const playAgainButton = document.getElementById('play-again');
    if (playAgainButton) {
        playAgainButton.addEventListener('click', () => {
            currentLevel = 0;
            score = 0;
            lives = 3;
            document.getElementById('score').innerText = score;
            document.getElementById('end-screen').classList.add('hidden');
            document.getElementById('game-container').classList.remove('hidden');
            loadLevel();
        });
    }

    // Dark mode toggle initialization
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            darkModeToggle.classList.toggle('bi-moon');
            darkModeToggle.classList.toggle('bi-sun');
        });
    }

    // Initialize leaderboard if it exists
    const leaderboardElement = document.getElementById('leaderboard');
    if (leaderboardElement) {
        updateLeaderboard();
    }
});

// Add mock leaderboard data
const leaderboardData = [
    { name: "Ahmet", score: 1200 },
    { name: "Mehmet", score: 1100 },
    { name: "Ayşe", score: 1000 },
    { name: "Fatma", score: 900 },
    { name: "Ali", score: 800 }
];

const updateLeaderboard = () => {
    const leaderboard = document.getElementById('leaderboard');
    // Only update if leaderboard element exists
    if (leaderboard) {
        leaderboard.innerHTML = leaderboardData
            .map((player, index) => `
                <div class="leaderboard-item">
                    <span class="rank">#${index + 1}</span>
                    <span class="name">${player.name}</span>
                    <span class="score">${player.score}</span>
                </div>
            `).join('');
    }
};

// Helper functions for rhyme detection
const countSyllables = (text) => {
    let vowels = ["a", "e", "ı", "i", "o", "ö", "u", "ü"];
    let syllables = 0;
    for (let i = 0; i < text.length; i++) {
        if (vowels.includes(text[i].toLowerCase())) {
            syllables++;
        }
    }
    return syllables;
};

const getLastWord = (text) => {
    let words = text.split(" ");
    return words[words.length - 1];
};

const countVowelPattern = (word) => {
    let vowels = ["a", "e", "ı", "i", "o", "ö", "u", "ü"];
    return word.split("").filter(char => vowels.includes(char.toLowerCase())).join("");
};

const rhymeScore = (word1, word2) => {
    let pattern1 = countVowelPattern(word1);
    let pattern2 = countVowelPattern(word2);
    let minLength = Math.min(pattern1.length, pattern2.length);
    let score = 0;
    
    for (let i = 1; i <= minLength; i++) {
        if (pattern1[pattern1.length - i] === pattern2[pattern2.length - i]) {
            score++;
        } else {
            break;
        }
    }
    return score;
};

const findBestChoice = (line, choices) => {
    let targetSyllables = countSyllables(line);
    let targetLastWord = getLastWord(line);
    let bestScore = -1;
    let bestChoice = 0;

    choices.forEach((choice, index) => {
        let choiceSyllables = countSyllables(choice);
        let choiceLastWord = getLastWord(choice);
        
        let syllableDifference = Math.abs(targetSyllables - choiceSyllables);
        let rhymeMatch = rhymeScore(targetLastWord, choiceLastWord);
        
        let totalScore = (10 - syllableDifference) + (rhymeMatch * 5);
        
        if (totalScore > bestScore) {
            bestScore = totalScore;
            bestChoice = index;
        }
    });
    
    return bestChoice;
};

// Modify the levels array to not include pre-defined correct answers
let levels = [
    { 
        line: "bu yoldan yine geçerim", 
        choices: ["senin sevdiğini bilirim", "şansımı yine denerim", "geç kalmış değilim", "tek yapraklı bir çiçeğim"]
    },
    { 
        line: "gökyüzüne bak yıldızlara", 
        choices: ["seninle geçer anılarla", "hayalimdeki deniz kenarı", "tut elimi kaybolalım rüzgarda", "sıcak bir günde serin sulara"]
    },
    { 
        line: "sessiz bir akşam vakti", 
        choices: ["güneş batarken denize", "rüzgar eserken hafifçe", "yağmur yağarken sessizce", "ay doğarken gökyüzüne"]
    },
    { 
        line: "kalbin çarpar uzaklarda", 
        choices: ["sevgi dolar sokaklara", "umut yeşerir baharda", "özlem büyür yıldızlarda", "hayat akar zamanlarda"]
    },
    { 
        line: "bir gün elbet döneceğim", 
        choices: ["seni tekrar göreceğim", "uzaklara gideceğim", "başka yere varacağım", "her şeyi unutacağım"]
    }
];

let currentLevel = 0;
let score = 0;
let lives = 3;
let timeLeft = 15;
let timerInterval;

const startTimer = () => {
    timeLeft = 15;
    document.getElementById("time-left").innerText = timeLeft;
    document.getElementById("progress-bar").style.width = "100%";
    document.getElementById("progress-bar").style.background = "green";
    document.getElementById("time-left").classList.remove("shake");
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").innerText = timeLeft;
        document.getElementById("progress-bar").style.width = (timeLeft / 15) * 100 + "%";
        
        if (timeLeft <= 5) {
            document.getElementById("progress-bar").style.background = "red";
            document.getElementById("time-left").classList.add("shake");
            document.getElementById("time-left").style.color = "red";
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            lives--;
            updateLives();
            if (lives <= 0) {
                endGame();
            } else {
                loadLevel();
            }
        }
    }, 1000);
};

const loadLevel = () => {
    if (!gameStarted) return;
    
    if (currentLevel >= levels.length || lives <= 0) {
        endGame();
        return;
    }
    
    let level = levels[currentLevel];
    document.getElementById("line").innerText = level.line;
    document.getElementById("choices").innerHTML = "";
    
    level.choices.forEach((choice, index) => {
        let btn = document.createElement("button");
        btn.classList.add("choice-btn");
        btn.innerText = choice;
        btn.onclick = () => checkAnswer(index);
        document.getElementById("choices").appendChild(btn);
    });

    startTimer();
    // Update current level display if it exists
    const currentLevelDisplay = document.getElementById("current-level");
    if (currentLevelDisplay) {
        currentLevelDisplay.textContent = currentLevel + 1;
    }
    // Only call updateLeaderboard if we're on the dashboard page
    if (document.getElementById('leaderboard')) {
        updateLeaderboard();
    }
};

// Modify checkAnswer function to use rhyme detection
const checkAnswer = (index) => {
    clearInterval(timerInterval);
    let bestChoice = findBestChoice(levels[currentLevel].line, levels[currentLevel].choices);
    
    if (index === bestChoice) {
        score += 100;
        document.getElementById("score").innerText = score;
        document.getElementById("message").innerText = "Doğru!";
        currentLevel++;
        if (currentLevel < levels.length && lives > 0) {
            showTransition();
        } else {
            endGame();
        }
    } else {
        document.getElementById("message").innerText = "Yanlış! En iyi eşleşme: " + levels[currentLevel].choices[bestChoice];
        lives--;
        updateLives();
        if (lives > 0) {
            loadLevel();
        } else {
            endGame();
        }
    }
};

const updateLives = () => {
    for (let i = 1; i <= 3; i++) {
        const heart = document.getElementById(`life${i}`);
        if (i > lives) {
            heart.querySelector('i').classList.remove('bi-heart-fill');
            heart.querySelector('i').classList.add('bi-heart');
            heart.classList.add('lost-life');
        } else {
            heart.querySelector('i').classList.add('bi-heart-fill');
            heart.querySelector('i').classList.remove('bi-heart');
            heart.classList.remove('lost-life');
        }
    }
};

const showTransition = () => {
    document.getElementById("transition-screen").classList.remove("hidden");
    setTimeout(() => {
        document.getElementById("transition-screen").classList.add("hidden");
        loadLevel();
    }, 1000);
};

const endGame = () => {
    clearInterval(timerInterval);
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("final-score").innerText = score;
    document.getElementById("end-screen").classList.remove("hidden");
};

// Don't auto-start the game
// Remove or comment out the automatic loadLevel() call at the end of the file
// loadLevel();