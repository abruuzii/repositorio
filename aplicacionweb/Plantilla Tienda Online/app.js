const contenedorProductos = document.getElementById('productos');
const pantallaCarga = document.getElementById('pantalla-carga');
const contenedorCategorias = document.getElementById('categorias'); // Contenedor de filtros
const inputBusqueda = document.getElementById('buscador'); // Input de búsqueda

const API_CATEGORIAS = 'http://localhost:8000/api/categorias';
const API_URL = 'http://localhost:8000/api/productos'; // Cambia el puerto si es necesario

let categoriasSeleccionada = "all"; // Variable para almacenar la categoría seleccionada
let productos = [];

async function cargarProductos() {
    try {
        // Mostrar la pantalla de carga
        pantallaCarga.style.display = 'flex';

        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        productos = await respuesta.json();

        if (productos.length === 0) {
            console.log('No hay productos disponibles');
        } else {
            // Mostrar los productos en la página
            mostrarProductos(productos);
        }
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    } finally {
        // Ocultar la pantalla de carga
        pantallaCarga.style.display = 'none';
    }
}

async function cargarCategorias() {
    try {
        const respuesta = await fetch(API_CATEGORIAS);
        if (!respuesta.ok) {
            throw new Error('Error al cargar las categorías');
        }
        const productosAPI = await respuesta.json();
        // Extraer nombres únicos de todas las categorías de todos los productos
        const categoriasSet = new Set();
        productosAPI.forEach(p => {
            if (Array.isArray(p.categorias)) {
                p.categorias.forEach(cat => categoriasSet.add(cat.nombre));
            }
        });
        const categorias = Array.from(categoriasSet);
        generarFiltros(categorias);
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}

function filtrarProductos() {
    let filtrados = productos;

    // Filtrar por texto del buscador
    const texto = inputBusqueda.value.toLowerCase();
    if (texto.trim() !== '') {
        filtrados = filtrados.filter((p) =>
            p.titulo.toLowerCase().includes(texto) ||
            p.descripcion.toLowerCase().includes(texto)
        );
    }

    // Filtrar por categoría seleccionada
    if (categoriasSeleccionada !== 'all') {
        filtrados = filtrados.filter((p) =>
            p.categorias.some(cat => cat.nombre === categoriasSeleccionada)
        );
    }

    mostrarProductos(filtrados);
}

function generarFiltros(categorias) {
    contenedorCategorias.innerHTML = '';

    const botonTodos = document.createElement('button');
    botonTodos.textContent = "Todos";
    botonTodos.className = `p-2 rounded-lg px-4 py-2 rounded-full ${
        categoriasSeleccionada === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
    } hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`;

    botonTodos.addEventListener('click', () => {
        categoriasSeleccionada = 'all';
        generarFiltros(categorias);
        filtrarProductos();
    });

    contenedorCategorias.appendChild(botonTodos);

    categorias.forEach(categoria => {
        const boton = document.createElement('button');
        boton.textContent = categoria;
        boton.className = `p-2 rounded-lg px-4 py-2 rounded-full ${
            categoriasSeleccionada === categoria ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
        } hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`;

        boton.addEventListener('click', () => {
            categoriasSeleccionada = categoria;
            generarFiltros(categorias);
            filtrarProductos();
        });

        contenedorCategorias.appendChild(boton);
    });
}

function mostrarProductos(productos) {
    console.log("Productos a mostrar:", productos);
    contenedorProductos.innerHTML = '';

    if (productos.length === 0) {
        contenedorProductos.innerHTML = '<p class="text-center text-gray-600">No se encontraron productos.</p>';
        return;
    }

    productos.forEach(producto => {
        // Toma la primera categoría si hay varias
        const categoria = producto.categorias && producto.categorias.length > 0 ? producto.categorias[0].nombre : 'Sin categoría';
        const productoDiv = document.createElement('div');
        productoDiv.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-300';
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}" class="w-32 h-32 object-contain mb-4">
            <p class="text-lg font-semibold mb-2">${producto.titulo}</p>
            <p class="text-gray-600 mb-2">${producto.descripcion}</p>
            <p class="text-gray-600 mb-4">Precio: $${producto.precio}</p>
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-2">Agregar al carrito</button>
            <a href="detalle.html?id=${producto.id}" class=" bg-black text-white px-4 py-2 rounded shadow hover:bg-[#818c8a] transition font-semibold text-center block">
                Detalles
            </a>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}

// Llamar a las funciones para cargar los productos y las categorías al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarCategorias();

    // Agregar evento al buscador
    inputBusqueda.addEventListener('input', filtrarProductos);

    // Mostrar opción CRUD solo para admin
    if (localStorage.getItem('is_admin') === 'true') {
        // Mostrar botón CRUD
        const crudLink = document.createElement('a');
        crudLink.href = 'subir-imagen.html';
        crudLink.textContent = 'CRUD Productos';
        crudLink.className = 'text-white font-medium hover:text-blue-900 transition';
        const crudContainer = document.getElementById('crud-link-container');
        if (crudContainer) {
            crudContainer.innerHTML = '';
            crudContainer.appendChild(crudLink);
        }

        // Cambiar botón de sesión por leyenda de admin y botón de cerrar sesión
        const cerrarSesionDiv = document.getElementById('cerrar-sesion-escritorio');
        if (cerrarSesionDiv) {
            cerrarSesionDiv.innerHTML = `
                <span class="text-green-400 font-bold ml-4">Usuario Administrador</span>
                <button id="logout-btn" class="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Cerrar sesión</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('is_admin');
                localStorage.removeItem('user_email');
                window.location.href = 'login.html';
            });
        }
    } else {
        // Escritorio
        const cerrarSesionDiv = document.getElementById('cerrar-sesion-escritorio');
        // Móvil
        const cerrarSesionMovil = document.getElementById('cerrar-sesion-movil');

        if (localStorage.getItem('user_email')) {
            // Escritorio
            if (cerrarSesionDiv) {
                cerrarSesionDiv.innerHTML = `
                    <button id="logout-btn" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                        Cerrar sesión
                    </button>
                `;
                document.getElementById('logout-btn').addEventListener('click', () => {
                    localStorage.clear();
                    window.location.href = 'login.html';
                });
            }
            // Móvil
            if (cerrarSesionMovil) {
                cerrarSesionMovil.innerHTML = `
                    <button id="logout-btn-movil" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition w-full mt-2">
                        Cerrar sesión
                    </button>
                `;
                document.getElementById('logout-btn-movil').addEventListener('click', () => {
                    localStorage.clear();
                    window.location.href = 'login.html';
                });
            }
        }
    }
});

fetch('http://localhost:8000/api/productos')
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById('productos');
    const titulo = document.getElementById('titulo-productos');
    contenedor.innerHTML = ''; // Limpia antes de agregar
    if (productos.length > 0) {
      titulo.classList.remove('hidden');
      productos.forEach(p => {
        const card = document.createElement('div');
        card.className = "bg-white shadow-md rounded p-4 flex flex-col items-center";
        card.innerHTML = `
          <img src="${p.imagen}" class="w-full h-48 object-cover rounded mb-4" alt="${p.titulo}">
          <h3 class="text-lg font-semibold">${p.titulo}</h3>
          <p class="text-gray-700">${p.descripcion}</p>
          <p class="text-green-600 font-bold">\$${p.precio}</p>
          <p class="text-sm text-gray-500">Stock: ${p.stock}</p>
        `;
        contenedor.appendChild(card);
      });
    } else {
      titulo.classList.add('hidden');
      contenedor.innerHTML = '<p class="text-red-600">No se encontraron productos.</p>';
    }
  })
  .catch(error => {
    console.error('Error al cargar productos:', error);
    const contenedor = document.getElementById('productos');
    const titulo = document.getElementById('titulo-productos');
    titulo.classList.add('hidden');
    contenedor.innerHTML = '<p class="text-red-600">No se pudieron cargar los productos.</p>';
  });