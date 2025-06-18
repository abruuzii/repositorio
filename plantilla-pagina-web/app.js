const contenedorProductos = document.getElementById("productos");
const contenedorCategorias = document.getElementById("categorias");
const inputBuscar = document.getElementById("busqueda");

let productos = [];
let categoriaSeleccionada = "all";
let categoriaMap = {};
// Cargar productos desde la API
async function cargarProductos() {
    try {
        mostrarMensajeCargando();
        const respuesta = await fetch("http://127.0.0.1:8000/api/productos");
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }
        productos = await respuesta.json();
        if (productos.length === 0) {
            mostrarMensajeError("No se encontraron productos en la API");
        } else {
            mostrarProductos(productos);
        }
    } catch (error) {
        console.error("Error al cargar los productos: ", error);
        mostrarMensajeError();
    }
}

// Filtrar productos por búsqueda y categoría
function filtrarProductos() {
    let filtrados = productos;
    const textoBusqueda = inputBuscar.value.toLowerCase();
    if (textoBusqueda.trim() !== "") {
        filtrados = filtrados.filter((p) =>
            p.title.toLowerCase().includes(textoBusqueda) ||
            p.description.toLowerCase().includes(textoBusqueda)
        );
    }
    if (categoriaSeleccionada !== "all") {
        const categoriaId = categoriaMap[categoriaSeleccionada];
        filtrados = filtrados.filter((p) => {
            // Si el producto tiene un array de categorias relacionadas
            if (Array.isArray(p.categorias)) {
                return p.categorias.some(cat => String(cat.id) === String(categoriaId));
            }
            return false;
        });
    }
    mostrarProductos(filtrados);
}

// Cargar categorías desde la API
async function cargarCategorias() {
    try {
        const respuesta = await fetch("http://127.0.0.1:8000/api/categoria");
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }
        const categorias = await respuesta.json();
        // Crear el mapa slug -> id
        categoriaMap = {};
        categorias.forEach(cat => {
            categoriaMap[cat.slug] = cat.id;
        });
        mostrarCategorias([{ slug: "all", nombre: "Todas" }, ...categorias]);
    } catch (error) {
        console.error("Error al cargar las categorias: ", error);
    }
}

// Mostrar productos en el contenedor
function mostrarProductos(productosAMostrar) {
    contenedorProductos.innerHTML = "";
    const esAdmin = localStorage.getItem('rol') === 'admin';
    const tieneToken = !!localStorage.getItem('authToken');
    if (productosAMostrar.length === 0) {
        contenedorProductos.innerHTML =
            "<p class='text-2xl font-bold text-center text-gray-800 col-span-full m-4'>No se encontraron productos.</p>";
    } else {
        productosAMostrar.forEach((producto) => {
            const productoDiv = document.createElement("div");
            productoDiv.className =
                "bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center border border-black";
            productoDiv.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.titulo}" class="w-40 h-40 object-contain mb-4 rounded-lg border  bg-white">
                <h3 class="text-2xl font-bold text-black mb-2">${producto.titulo}</h3>
                <p class="text-black mb-2">${producto.descripcion}</p>
                <p class="text-black font-bold mb-2">$${producto.precio}</p>
                <p class="text-black mb-2">Stock: ${producto.stock}</p>
                ${(!esAdmin && tieneToken) ? `
                <button class="btn--carrito bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300" data-id="${producto.id}"> al carrito</button>
                ` : ''}
                <a href="detalle.html?id=${producto.id}" class="bg-black text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors duration-300 mt-2 block text-center">Detalles</a>
            `;
            contenedorProductos.appendChild(productoDiv);
        });
        // Asignar eventos a los botones "Agregar al carrito"
        if (!esAdmin && tieneToken) {
            document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const productoId = this.getAttribute('data-id');
                    await agregarAlCarrito(productoId, 1);
                });
            });
        }
    }
}

// Función para agregar producto al carrito
async function agregarAlCarrito(productoId, cantidad = 1) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Debes iniciar sesión para agregar productos al carrito');
        return;
    }
    try {
        const res = await fetch('http://127.0.0.1:8000/api/carrito/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ producto_id: productoId, cantidad })
        });
        if (res.ok) {
            mostrarToast('Producto agregado al carrito', 'success');
        } else {
            const data = await res.json().catch(() => ({}));
            mostrarToast(data.message || 'Error al agregar al carrito', 'error');
        }
    } catch (e) {
        mostrarToast('Error de conexión al agregar al carrito', 'error');
    }
}

// Mostrar botones de categorías
function mostrarCategorias(categorias) {
    contenedorCategorias.innerHTML = "";
    categorias.forEach((categoria) => {
        const categoriaButton = document.createElement("button");
        categoriaButton.className = `px-8 py-2 rounded-full ${categoriaSeleccionada === categoria.slug ? "bg-yellow-500 text-black" : "bg-white text-black"} font-bold hover:bg-[#f7fc8d] hover:text-black/40 transition-colors duration-300 border border-black`;
        categoriaButton.textContent = categoria.nombre;
        categoriaButton.addEventListener("click", () => {
            categoriaSeleccionada = categoria.slug;
            mostrarCategorias(categorias);
            filtrarProductos();
        });
        contenedorCategorias.appendChild(categoriaButton);
    });
}

// Mensaje de carga
function mostrarMensajeCargando() {
    contenedorProductos.innerHTML = `
        <div class="col-span-full m-4 text-center">
            <img src="images/cargando.gif" alt="Cargando..." class="mx-auto w-22 h-22 mb-2 ">
            <p class="text-2xl font-bold text-gray-800">Cargando productos...</p>
        </div>
    `;
}


// Mensaje de error
function mostrarMensajeError(mensaje = "Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.") {
    contenedorProductos.innerHTML = `
        <div class="col-span-full m-4 text-center">
            <p class='text-2xl font-bold text-center text-gray-800'>${mensaje}</p>
        </div>
    `;
}

// Eliminar producto de la base de datos y de Firebase Storage
async function eliminarProducto(id, imagenUrl) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
        // Eliminar de la base de datos
        const res = await fetch(`http://127.0.0.1:8000/api/productos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            }
        });
        if (res.ok) {
            // Eliminar de Firebase Storage
            if (imagenUrl) {
                try {
                    const storageRef = firebase.storage().refFromURL(imagenUrl);
                    await storageRef.delete();
                } catch (e) {
                    // Si falla la eliminación de la imagen, solo muestra un warning
                    alert('Producto eliminado, pero no se pudo borrar la imagen de Firebase.');
                }
            }
            alert('Producto eliminado correctamente.');
            window.location.reload();
        } else {
            alert('Error al eliminar el producto de la base de datos.');
        }
    } catch (err) {
        alert('Error al eliminar el producto.');
    }
}

// Toast de notificación
function mostrarToast(mensaje, tipo = 'success') {
    let toast = document.getElementById('toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-msg';
        toast.className = 'fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-lg font-bold';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.className = 'fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-lg font-bold ' +
        (tipo === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white');
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2200);
}

// Eventos
inputBuscar.addEventListener("input", filtrarProductos);

document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    cargarProductos();
    const authBtnContainer = document.getElementById('auth-btn-container');
    const token = localStorage.getItem('authToken');
    if (token) {
      authBtnContainer.innerHTML = `
        <button id="logout-btn" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300">Cerrar Sesión</button>
      `;
      document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('rol');
        window.location.reload();
      });
    } else {
      authBtnContainer.innerHTML = `
        <a href="login.html" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">Iniciar Sesión</a>
      `;
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  const path = window.location.pathname;
  
  // Detectar si es pública
  const paginasPublicas = ['index.html', 'contacto.html', 'login.html', 'registro.html'];
  const esPaginaPublica = paginasPublicas.some(p => path.endsWith(p));

  if (!token && !esPaginaPublica) {
    window.location.href = 'login.html';
  }
});
