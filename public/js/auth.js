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

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const formId = button.getAttribute('data-tab') + '-form';
            document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));
            document.getElementById(formId).classList.remove('hidden');
        });
    });

    // Login form handler
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const email = e.target.querySelector('[type="email"]').value;
            const password = e.target.querySelector('[type="password"]').value;

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user.id);
                window.location.href = '/dashboard';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    });

    // Register form handler
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const username = e.target.querySelector('[placeholder="Kullanıcı Adı"]').value;
            const email = e.target.querySelector('[type="email"]').value;
            const password = e.target.querySelector('[placeholder="Şifre"]').value;
            const confirmPassword = e.target.querySelector('[placeholder="Şifre Tekrar"]').value;

            if (password !== confirmPassword) {
                alert('Şifreler eşleşmiyor');
                return;
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user.id);
                window.location.href = '/dashboard';
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    });

    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token && window.location.pathname === '/') {
        window.location.href = '/dashboard';
    }
});
