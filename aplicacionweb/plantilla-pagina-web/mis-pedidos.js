

async function cargarMisPedidos() {
    const contenedor = document.getElementById('mis-pedidos-contenido');
    contenedor.innerHTML = '<div class="text-black">Cargando tus pedidos...</div>';
    try {
        const res = await fetch('http://127.0.0.1:8000/api/pedidos/mis', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
        });
        if (!res.ok) {
            contenedor.innerHTML = '<div class="text-red-400">No se pudieron cargar tus pedidos.</div>';
            return;
        }
        const pedidos = await res.json();
        if (!Array.isArray(pedidos) || pedidos.length === 0) {
            contenedor.innerHTML = '<div class="text-red-600">No tienes pedidos realizados.</div>';
            return;
        }
        let tabla = `<table class='min-w-full border-black bg-white text-black'><thead><tr>
            <th class='px-2 py-1'>ID</th>
            <th class='px-2 py-1'>Dirección</th>
            <th class='px-2 py-1'>Provincia</th>
            <th class='px-2 py-1'>Teléfono</th>
            <th class='px-2 py-1'>Total</th>
            <th class='px-2 py-1'>Estado</th>
            <th class='px-2 py-1'>Fecha</th>
            <th class='px-2 py-1'>Productos</th>
        </tr></thead><tbody>`;
        pedidos.forEach(pedido => {
            let productosHtml = '<ul class="list-disc pl-4">';
            const items = pedido.pedidoProductos || pedido.pedido_productos || [];
            items.forEach(item => {
                const prod = item.producto;
                productosHtml += `<li>${prod ? prod.titulo : 'Producto eliminado'} x${item.cantidad} ($${item.precio_unitario})</li>`;
            });
            productosHtml += '</ul>';
            tabla += `<tr>
                <td class='border px-2 py-1'>${pedido.id}</td>
                <td class='border px-2 py-1'>${pedido.direccion ? pedido.direccion.direccion : 'N/A'}</td>
                <td class='border px-2 py-1'>${pedido.direccion ? pedido.direccion.provincia : 'N/A'}</td>
                <td class='border px-2 py-1'>${pedido.direccion ? pedido.direccion.telefono : 'N/A'}</td>
                <td class='border px-2 py-1'>$${pedido.total}</td>
                <td class='border px-2 py-1'>${pedido.estado}</td>
                <td class='border px-2 py-1'>${pedido.fecha_pedido ? pedido.fecha_pedido.substring(0, 10) : ''}</td>
                <td class='border px-2 py-1'>${productosHtml}</td>
            </tr>`;
        });
        tabla += '</tbody></table>';
        contenedor.innerHTML = tabla;
    } catch (e) {
        contenedor.innerHTML = '<div class="text-red-400">Error al cargar tus pedidos.</div>';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    cargarMisPedidos();
});