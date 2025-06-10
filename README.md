# 🛍️ Proyecto de Tienda Online

Este proyecto es una tienda web desarrollada para mostrar productos, permitir la gestión por parte de un administrador y brindar una experiencia simple y funcional a los usuarios. Incluye un panel para subir imágenes de productos, autenticación de usuarios y administración de contenido.

## 🚀 Descripción del Proyecto

El sistema cuenta con:

- **Frontend**: Página web que permite visualizar productos y detalles.
- **Backend (Laravel)**: Módulo de administración para gestionar productos, categorías, usuarios y pedidos.
- **Firebase Storage**: Para subir y almacenar imágenes de productos.
- **Sistema de autenticación** para distinguir entre usuarios y administradores.
- **Subida de imágenes** con vista previa y generación automática de URL pública.

## 🛠️ Tecnologías Utilizadas

- HTML, CSS, JavaScript
- Laravel (PHP)
- Firebase Storage
- MySQL
- Git & GitHub

## 🧪 Requisitos Previos

- PHP 8.x
- Composer
- Node.js y npm (para Laravel Mix, si usas)
- MySQL o MariaDB
- Git
- Cuenta en Firebase con Storage habilitado

## 📥 Pasos para Clonar y Ejecutar el Proyecto

1. Clona el repositorio:
git clone https://github.com/abruuzii/repositorio.git
cd repositorio
2. Ingresa a la carpeta del backend:
cd catalogo_back/catalogo-laravel

3.Instala dependencias de Laravel:
composer install

4. Crea un archivo .env a partir del ejemplo y configura tu base de datos:
cp .env.example .env

5. Genera la clave de la aplicación:
php artisan key:generate

6. Crea la base de datos en MySQL y ejecuta las migraciones:
php artisan migrate

7. Inicia el servidor:
php artisan serve

8. Abre el frontend (subir-imagen.html o index.html) desde el navegador para visualizar o subir productos.

