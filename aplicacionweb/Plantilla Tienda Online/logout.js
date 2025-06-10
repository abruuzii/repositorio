document.addEventListener('DOMContentLoaded', function() {
    const btnCerrarSesion = `
        <button id="cerrar-sesion-btn" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-semibold w-full">
            Cerrar Sesión
        </button>
    `;
    const btnIniciarSesion = `
        <button id="iniciar-sesion-btn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold w-full">
            Iniciar Sesión
        </button>
    `;
    const escritorio = document.getElementById('cerrar-sesion-escritorio');
    const movil = document.getElementById('cerrar-sesion-movil');

    if (localStorage.getItem('user_email')) {

        if (escritorio) escritorio.innerHTML = btnCerrarSesion;
        if (movil) movil.innerHTML = btnCerrarSesion.replace('cerrar-sesion-btn', 'cerrar-sesion-btn-movil');

        document.getElementById('cerrar-sesion-btn')?.addEventListener('click', function() {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
        document.getElementById('cerrar-sesion-btn-movil')?.addEventListener('click', function() {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    } else {
        if (escritorio) escritorio.innerHTML = btnIniciarSesion;
        if (movil) movil.innerHTML = btnIniciarSesion.replace('iniciar-sesion-btn', 'iniciar-sesion-btn-movil');

        document.getElementById('iniciar-sesion-btn')?.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
        document.getElementById('iniciar-sesion-btn-movil')?.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
});