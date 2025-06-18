Este proyecto es una aplicación web que integra frontend y backend para la gestión de una tienda en línea. Permite a los usuarios visualizar productos, registrarse, iniciar sesión, realizar compras y a los administradores gestionar el catálogo y los pedidos.

🚀 Tecnologías Utilizadas

- HTML5 / CSS3
- JavaScript
- TailwindCSS
- Laravel (Framework PHP)
- MySQL
- Firebase (para almacenamiento de imágenes)
- Git y GitHub

🛠️ Pasos para Clonar y Ejecutar el Proyecto
🔧 Requisitos Previos
Asegúrate de tener instalado:
- Git
- Node.js y npm
- Composer
- Un servidor local (como XAMPP, Laragon, Valet, etc.)

📥 Clonar el Repositorio

git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio

Reemplaza la URL con la de tu repositorio.
🧱 Frontend

1. Entra en la carpeta `aplicacionweb/`
2. Abre `index.html` en tu navegador o en un servidor local

⚙️ Backend (Laravel)

1. Entra en la carpeta `catalogo_back/`
2. Copia el archivo `.env.example` a `.env`:

cp .env.example .env

3. Genera la clave de aplicación:

php artisan key:generate

4. Configura la base de datos en el archivo `.env`
5. Ejecuta las migraciones:

php artisan migrate

6. Inicia el servidor de desarrollo:

php artisan serve

📌 Notas Adicionales

- La API utiliza autenticación basada en tokens.
- Las imágenes se suben desde el frontend y se almacenan en Firebase Storage.
- El sistema diferencia roles (cliente, administrador) con diferentes vistas y permisos.

