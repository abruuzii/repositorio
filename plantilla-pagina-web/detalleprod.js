async function cargarDetalleProducto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('detalleProducto').innerHTML = '<p class="text-red-500">Producto no encontrado.</p>';
    return;
  }

  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/api/productos/${id}`);
    if (!respuesta.ok) throw new Error("Error en la respuesta");

    const producto = await respuesta.json();
    let nombresCategorias = '';
    if (Array.isArray(producto.categorias)) {
      nombresCategorias = producto.categorias.map(cat => cat.nombre).join(', ');
    } else if (producto.categorias && producto.categorias.nombre) {
      nombresCategorias = producto.categorias.nombre;
    } else {
      nombresCategorias = 'Sin categoría';
    }

    // Renderizar producto con botón y contenedor para mensaje
    document.getElementById('detalleProducto').innerHTML = `
      <img src="${producto.imagen}" alt="${producto.titulo}" class="w-full md:w-1/2 rounded-md object-contain max-h-96" />
      <div class="flex-1">
        <h2 class="text-2xl font-semibold mb-2">${producto.titulo}</h2>
        <p class="text-gray-600 mb-4">${nombresCategorias}</p>
        <p class="text-gray-700 mb-4">${producto.descripcion}</p>
        <p class="text-lg font-bold text-green-600 mb-4">$${producto.precio}</p>

        <div id="mensaje-carrito" class="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"></div>

        <button id="btn-agregar-carrito" class="bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-300">
          Agregar al carrito
        </button>
      </div>
    `;

    const btnAgregar = document.getElementById('btn-agregar-carrito');
    const mensaje = document.getElementById('mensaje-carrito');
    const token = localStorage.getItem('authToken');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'cliente') {
      btnAgregar.style.display = 'none';
      return;
    }

    btnAgregar.addEventListener('click', async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/carrito/agregar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ producto_id: id, cantidad: 1 })
        });

        const data = await res.json();

        if (res.ok) {
          mensaje.textContent = "Producto agregado al carrito";
          mensaje.classList.remove('hidden');

          setTimeout(() => {
            mensaje.classList.add('hidden');
          }, 3000);
        } else {
          alert(data.message || "Error al agregar al carrito");
        }
      } catch (err) {
        alert("Error de conexión al agregar al carrito");
      }
    });

  } catch (error) {
    console.error("Error al cargar detalle:", error);
    document.getElementById('detalleProducto').innerHTML = '<p class="text-red-500">No se pudo cargar el producto.</p>';
  }
}

document.addEventListener("DOMContentLoaded", cargarDetalleProducto);
