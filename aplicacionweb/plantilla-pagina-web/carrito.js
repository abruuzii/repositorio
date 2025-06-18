// carrito.js
// Lógica para mostrar, actualizar y comprar el carrito

// Solo ejecuta la lógica si estamos en carrito.html
if (window.location.pathname.endsWith('carrito.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!localStorage.getItem('authToken') || localStorage.getItem('rol') !== 'cliente') {
            window.location.href = 'login.html';
            return;
        }
        cargarCarrito();
        cargarMisPedidos();
    });
}

async function cargarCarrito() {
    const token = localStorage.getItem('authToken');
    const contenedor = document.getElementById('carrito-contenido');
    const totalDiv = document.getElementById('carrito-total');
    const mensajeDiv = document.getElementById('carrito-mensaje');
    contenedor.innerHTML = '<div class="text-white">Cargando carrito...</div>';
    totalDiv.textContent = '';
    mensajeDiv.textContent = '';
    try {
        const res = await fetch('http://127.0.0.1:8000/api/carrito', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (!data.productos || data.productos.length === 0) {
            contenedor.innerHTML = '<div class="text-white">Tu carrito está vacío.</div>';
            const btnComprar = document.getElementById('btn-comprar');
btnComprar.disabled = false;
btnComprar.onclick = () => {
    alert("Debes agregar productos al carrito antes de comprar.");
};

            totalDiv.textContent = '';
            return;
        }
        let total = 0;
        let tabla = `<table class='min-w-full text-black'><thead><tr>
            <th class='px-2 py-1'>Producto</th><th class='px-2 py-1'>Precio</th><th class='px-2 py-1'>Cantidad</th><th class='px-2 py-1'>Subtotal</th><th class='px-2 py-1'>Acciones</th></tr></thead><tbody>`;
        data.productos.forEach(item => {
            const prod = item.producto;
            const subtotal = prod.precio * item.cantidad;
            total += subtotal;
            tabla += `<tr>
                <td class='border px-2 py-1 flex items-center gap-2'><img src='${prod.imagen}' class='w-12 h-12 object-contain rounded'/>${prod.titulo}</td>
                <td class='border px-2 py-1'>$${prod.precio}</td>
                <td class='border px-2 py-1'><input type='number' min='1' value='${item.cantidad}' data-id='${prod.id}' class='cantidad-input w-16 text-black rounded px-2 py-1'/></td>
                <td class='border px-2 py-1'>$${subtotal}</td>
                <td class='border px-2 py-1'><button class='bg-red-600 text-white px-2 py-1 rounded eliminar-btn' data-id='${prod.id}'>Eliminar</button></td>
            </tr>`;
        });
        tabla += '</tbody></table>';
        contenedor.innerHTML = tabla;
        totalDiv.textContent = 'Total: $' + total.toFixed(2);

        let btnComprar = document.getElementById('btn-comprar');
btnComprar.disabled = false;

// Reemplazar el botón y actualizar la referencia
const nuevoBtn = btnComprar.cloneNode(true);
btnComprar.parentNode.replaceChild(nuevoBtn, btnComprar);
btnComprar = nuevoBtn;

btnComprar.addEventListener('click', async () => {
    if (carritoVacio()) {
        alert("Debes agregar productos al carrito antes de comprar.");
        return;
    }

    const direccionSeleccionada = document.querySelector('input[name="direccion_id"]:checked');
    if (!direccionSeleccionada) {
        alert("Por favor selecciona una dirección antes de comprar.");
        return;
    }

    try {
        const res = await fetch('http://127.0.0.1:8000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                direccion: {
                    id: direccionSeleccionada.value
                }
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error al procesar el pedido.");
            return;
        }

        alert("Pedido realizado con éxito. Redirigiendo...");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Error al crear el pedido:", error);
        alert("Error de conexión.");
    }
});



        // Eventos para actualizar cantidad
        document.querySelectorAll('.cantidad-input').forEach(input => {
            input.addEventListener('change', async function() {
                const nuevaCantidad = parseInt(this.value);
                const prodId = this.getAttribute('data-id');
                // Busca el producto actual para validar stock
                const item = data.productos.find(p => p.producto.id == prodId);
                if (nuevaCantidad < 1) return;
                if (nuevaCantidad > item.producto.stock) {
                    alert('No puedes agregar más de ' + item.producto.stock + ' unidades. Stock insuficiente.');
                    this.value = item.producto.stock;
                    return;
                }
                await actualizarCantidad(prodId, nuevaCantidad);
            });
        });
        // Eventos para eliminar producto
        document.querySelectorAll('.eliminar-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const prodId = this.getAttribute('data-id');
                await eliminarDelCarrito(prodId);
            });
        });
    } catch (e) {
        contenedor.innerHTML = '<div class="text-red-400">Error al cargar el carrito.</div>';
    }
}

async function actualizarCantidad(productoId, cantidad) {
    const token = localStorage.getItem('authToken');
    try {
        await fetch('http://127.0.0.1:8000/api/carrito/actualizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ producto_id: productoId, cantidad })
        });
        cargarCarrito();
    } catch (e) {
        alert('Error al actualizar cantidad.');
    }
}

async function eliminarDelCarrito(productoId) {
    const token = localStorage.getItem('authToken');
    try {
        await fetch('http://127.0.0.1:8000/api/carrito/eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ producto_id: productoId })
        });
        cargarCarrito();
    } catch (e) {
        alert('Error al eliminar producto.');
    }
}



// Verifica si el usuario tiene dirección antes de comprar
async function usuarioTieneDireccion() {
    const token = localStorage.getItem('authToken');
    const res = await fetch('http://127.0.0.1:8000/api/usuario/direcciones', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.direccion;
}

// Muestra formulario para capturar dirección
function mostrarFormularioDireccion(onSubmit) {
    let formHtml = `
        <div id="form-direccion-modal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form id="form-direccion" class="bg-white p-6 rounded shadow-md text-black min-w-[300px]">
                <h2 class="text-lg font-bold mb-2">Datos de dirección</h2>
                <label>Teléfono:<input type="text" id="telefono" name="telefono" class="block w-full mb-2 border" required></label>
                <label>Dirección:<input type="text" name="direccion" class="block w-full mb-2 border" required></label>
                <label>Ciudad:<input type="text" name="ciudad" class="block w-full mb-2 border" required></label>
                <label>Provincia:<input type="text" name="provincia" class="block w-full mb-2 border" required></label>
                <div class="flex gap-2 mt-4">
                    <button type="submit" class="bg-yellow-500 text-black px-4 py-1  hover:bg-yellow-300 rounded">Guardar y comprar</button>
                    <button type="button" id="cancelar-direccion" class="bg-gray-400 text-white px-4 py-1 rounded">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
    document.getElementById('cancelar-direccion').onclick = () => {
        document.getElementById('form-direccion-modal').remove();
    };
    document.getElementById('form-direccion').onsubmit = function(e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(this));
        document.getElementById('form-direccion-modal').remove();
        onSubmit(formData);
    };
}

// Modifica comprarCarrito para pedir SIEMPRE dirección
async function comprarCarrito() {
    const mensajeDiv = document.getElementById('carrito-mensaje');
    mensajeDiv.textContent = '';
    mostrarFormularioDireccion(async (direccionData) => {
        await comprarCarritoConDireccion(direccionData);
    });
}

// Nueva función para comprar con datos de dirección opcionales
async function comprarCarritoConDireccion(direccionData = null) {
    const token = localStorage.getItem('authToken');
    const mensajeDiv = document.getElementById('carrito-mensaje');
    mensajeDiv.textContent = '';
    try {
        const res = await fetch('http://127.0.0.1:8000/api/pedidos', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: direccionData ? JSON.stringify({ direccion: direccionData }) : undefined
        });
        const data = await res.json();
        if (res.ok) {
            mensajeDiv.innerHTML = `<span class='text-green-400 font-bold'>¡Pedido realizado! Estado: pendiente</span>`;
            cargarCarrito();
            cargarMisPedidos();
        } else {
            mensajeDiv.innerHTML = `<span class='text-red-400'>${data.message || 'Error al realizar el pedido.'}</span>`;
        }
    } catch (e) {
        mensajeDiv.innerHTML = `<span class='text-red-400'>Error al realizar el pedido.</span>`;
    }
}

// Nueva función para eliminar pedido
async function eliminarPedido(pedidoId) {
    const token = localStorage.getItem('authToken');
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/pedidos/${pedidoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
            cargarMisPedidos();
        } else {
            alert('No se pudo eliminar el pedido.');
        }
    } catch (e) {
        alert('Error al eliminar el pedido.');
    }
}


function carritoVacio() {
    const tabla = document.querySelector('#carrito-contenido table');
    const filas = tabla?.querySelectorAll('tbody tr');
    return !tabla || filas.length === 0;
}



