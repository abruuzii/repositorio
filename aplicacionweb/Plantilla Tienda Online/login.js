document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');

        if (usuario === 'admin@tienda.com' && password === 'admin123') {
            localStorage.setItem('is_admin', 'true');
            localStorage.setItem('user_email', usuario);
            window.location.href = 'index.html';
            return;
        }

        if (usuario && password) {
            localStorage.setItem('user_email', usuario);
            localStorage.setItem('is_admin', 'false'); // ✅ Se guarda como no admin
            window.location.href = 'index.html';
            return;
        }

        errorMsg.textContent = 'Usuario o contraseña incorrectos';
        errorMsg.classList.remove('hidden');
    });
});

