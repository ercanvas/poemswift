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

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const email = loginForm.querySelector('[type="email"]').value;
                const password = loginForm.querySelector('[type="password"]').value;

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
    }

    // Register form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const username = signupForm.querySelector('[placeholder="Kullanıcı Adı"]').value;
                const email = signupForm.querySelector('[type="email"]').value;
                const password = signupForm.querySelector('[placeholder="Şifre"]').value;
                const confirmPassword = signupForm.querySelector('[placeholder="Şifre Tekrar"]').value;

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
    }

    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token && window.location.pathname === '/') {
        window.location.href = '/dashboard';
    }
});
