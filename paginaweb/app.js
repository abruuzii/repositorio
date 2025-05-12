const contenedorProductos = document.getElementById('productos');
const pantallaCarga = document.getElementById('pantalla-carga');
const contenedorCategorias = document.getElementById('categorias'); // Contenedor de filtros
const inputBusqueda = document.getElementById('buscador'); // Input de búsqueda

let categoriasSeleccionada = "all"; // Variable para almacenar la categoría seleccionada
let productos = [];

async function cargarProductos() {
    try {
        // Mostrar la pantalla de carga
        pantallaCarga.style.display = 'flex';

        const respuesta = await fetch('https://fakestoreapi.com/products');
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
        const respuesta = await fetch('https://fakestoreapi.com/products/categories');
        if (!respuesta.ok) {
            throw new Error('Error al cargar las categorías');
        }
        const categorias = await respuesta.json();

        // Generar los filtros dinámicamente con las categorías obtenidas
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
            p.title.toLowerCase().includes(texto) ||
            p.description.toLowerCase().includes(texto)
        );
    }

    // Filtrar por categoría seleccionada
    if (categoriasSeleccionada !== 'all') {
        filtrados = filtrados.filter((p) => p.category === categoriasSeleccionada);
    }

    mostrarProductos(filtrados);
}

function generarFiltros(categorias) {
    // Limpiar el contenedor de categorías
    contenedorCategorias.innerHTML = '';

    // Agregar la opción "Todos" manualmente
    const botonTodos = document.createElement('button');
    botonTodos.textContent = "Todos";
    botonTodos.className = `p-2 rounded-lg px-4 py-2 rounded-full ${
        categoriasSeleccionada === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
    } hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`;

    // Agregar evento para filtrar todos los productos
    botonTodos.addEventListener('click', () => {
        categoriasSeleccionada = 'all';
        generarFiltros(categorias); // Actualizar los botones para reflejar la selección
        filtrarProductos(); // Filtrar los productos
    });

    contenedorCategorias.appendChild(botonTodos);

    // Crear un botón para cada categoría
    categorias.forEach(categoria => {
        const boton = document.createElement('button');
        boton.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        boton.className = `p-2 rounded-lg px-4 py-2 rounded-full ${
            categoriasSeleccionada === categoria ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
        } hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`;

        // Agregar evento para filtrar productos por categoría
        boton.addEventListener('click', () => {
            categoriasSeleccionada = categoria;
            generarFiltros(categorias); // Actualizar los botones para reflejar la selección
            filtrarProductos(); // Filtrar los productos
        });

        contenedorCategorias.appendChild(boton);
    });
}

function mostrarProductos(productos) {
    contenedorProductos.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos

    if (productos.length === 0) {
        contenedorProductos.innerHTML = '<p class="text-center text-gray-600">No se encontraron productos.</p>';
        return;
    }

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-300';
        productoDiv.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 object-contain mb-4">
            <p class="text-lg font-semibold mb-2">${producto.title}</p>
            <p class="text-gray-600 mb-4">Precio: $${producto.price}</p>
            <button class="btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                Agregar al carrito
            </button>
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
});