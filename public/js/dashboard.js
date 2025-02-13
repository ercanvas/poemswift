document.addEventListener('DOMContentLoaded', () => {
    // Handle mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Load leaderboard data
    const loadLeaderboard = async () => {
        try {
            const response = await fetch('/api/game/leaderboard');
            if (!response.ok) throw new Error('Failed to fetch leaderboard');
            
            const data = await response.json();
            const leaderboardElement = document.getElementById('leaderboard');
            
            leaderboardElement.innerHTML = data
                .map((score, index) => `
                    <div class="leaderboard-item">
                        <span class="rank">#${index + 1}</span>
                        <span class="name">${score.userId.username}</span>
                        <span class="score">${score.score}</span>
                    </div>
                `).join('');
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
    };

    // Load user stats
    const loadUserStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/';
                return;
            }

            const response = await fetch('/api/game/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch stats');
            
            const stats = await response.json();
            document.querySelector('.stat-item:nth-child(1) span').textContent = 
                `En Yüksek Skor: ${stats.highScore}`;
            document.querySelector('.stat-item:nth-child(2) span').textContent = 
                `Toplam Doğru: ${stats.totalCorrect}`;
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    // Check authentication
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
        }
    };

    // Initialize dashboard
    const initDashboard = () => {
        checkAuth();
        loadLeaderboard();
        loadUserStats();
    };

    // Add event listeners for game mode buttons
    document.querySelectorAll('.start-button').forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', (e) => {
                if (!e.target.href) {
                    e.preventDefault();
                    alert('Bu mod henüz aktif değil!');
                }
            });
        }
    });

    // Initialize the dashboard
    initDashboard();
});
