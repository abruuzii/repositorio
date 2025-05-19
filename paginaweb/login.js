document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('https://fakestoreapi.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            console.log('Respuesta de la API:', data); // <-- Añade esto para ver la respuesta

            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        } catch (err) {
            alert('Error al iniciar sesión');
            console.error(err); // <-- Añade esto para ver el error
        }
    });
});