document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabButtons = document.querySelectorAll('.tab-btn');

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const formId = button.getAttribute('data-tab') + '-form';
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.toggle('hidden', form.id !== formId);
            });
        });
    });

    // Login handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('[type="email"]').value;
        const password = loginForm.querySelector('[type="password"]').value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error('Login failed');
            
            const data = await res.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            alert('Login failed. Please try again.');
        }
    });

    // Signup handler
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = signupForm.querySelector('[placeholder="Kullanıcı Adı"]').value;
        const email = signupForm.querySelector('[type="email"]').value;
        const password = signupForm.querySelector('[placeholder="Şifre"]').value;
        const confirmPassword = signupForm.querySelector('[placeholder="Şifre Tekrar"]').value;

        if (password !== confirmPassword) {
            alert('Şifreler eşleşmiyor');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (!res.ok) throw new Error('Registration failed');
            
            const data = await res.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            alert('Registration failed. Please try again.');
        }
    });
});
