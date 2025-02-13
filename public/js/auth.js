class AuthService {
    constructor() {
        this.API_URL = 'http://localhost:5000/api';
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user._id);
                return data;
            }
            throw new Error(data.message);
        } catch (error) {
            throw error;
        }
    }

    async register(username, email, password) {
        try {
            const response = await fetch(`${this.API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user._id);
                return data;
            }
            throw new Error(data.message);
        } catch (error) {
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/index.html';
    }
}

// Initialize auth service and handle forms
const auth = new AuthService();

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const email = e.target.querySelector('[type="email"]').value;
        const password = e.target.querySelector('[type="password"]').value;
        await auth.login(email, password);
        window.location.href = '/dashboard.html';
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const username = e.target.querySelector('[placeholder="Kullanıcı Adı"]').value;
        const email = e.target.querySelector('[type="email"]').value;
        const password = e.target.querySelector('[placeholder="Şifre"]').value;
        const confirmPassword = e.target.querySelector('[placeholder="Şifre Tekrar"]').value;
        
        if (password !== confirmPassword) {
            throw new Error('Şifreler eşleşmiyor');
        }
        
        await auth.register(username, email, password);
        window.location.href = '/dashboard.html';
    } catch (error) {
        alert(error.message);
    }
});
