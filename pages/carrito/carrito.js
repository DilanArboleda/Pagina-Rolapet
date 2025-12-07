// Funciones del carrito
function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        // Aquí iría la lógica para eliminar del carrito
        document.querySelector(`[onclick="eliminarProducto(${id})"]`).closest('.carrito-producto').remove();
        alert('Producto eliminado del carrito');
    }
}

// Funcionalidad de botones cantidad
document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const span = this.parentElement.querySelector('span');
        let qty = parseInt(span.textContent);
        if (this.textContent === '-') {
            if (qty > 1) qty--;
        } else {
            qty++;
        }
        span.textContent = qty;
    });
});
