// Toggle Sidebar móvil
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Cargar datos del proveedor
function loadProfileData() {
    const proveedorName = localStorage.getItem('proveedorName') || 'Proveedor Principal';
    const email = localStorage.getItem('proveedorEmail') || 'proveedor@rolapet.com';

    document.getElementById('sidebarProveedorName').textContent = proveedorName;
    document.getElementById('sidebarProveedorEmail').textContent = email;
}

// Toggle detalles del pedido
function togglePedido(pedidoId) {
    const pedidoCard = document.querySelector(`[data-pedido-id="${pedidoId}"]`);
    const details = pedidoCard.querySelector('.pedido-details');
    const header = pedidoCard.querySelector('.pedido-header');

    details.classList.toggle('expanded');
    header.style.borderBottom = details.classList.contains('expanded') ? 'none' : '';
}

// Cambiar estado del pedido
function changeStatus(pedidoId, newStatus, event) {
    event.stopPropagation();

    const pedidoCard = document.querySelector(`[data-pedido-id="${pedidoId}"]`);
    const statusSpan = pedidoCard.querySelector('.pedido-status');
    const statusActions = pedidoCard.querySelector('.status-actions');
    const card = pedidoCard;

    let statusText, statusClass, nextButton;

    switch (newStatus) {
        case 'processing':
            statusText = 'En Proceso';
            statusClass = 'status-processing';
            nextButton = `<button class="status-btn status-shipped-btn" onclick="changeStatus(${pedidoId}, 'shipped', event)">
                            <i class="fa-solid fa-truck"></i> Marcar como Enviado
                          </button>`;
            break;
        case 'shipped':
            statusText = 'Enviado';
            statusClass = 'status-shipped';
            nextButton = `<button class="status-btn status-delivered-btn" onclick="changeStatus(${pedidoId}, 'delivered', event)">
                            <i class="fa-solid fa-check-double"></i> Marcar como Entregado
                          </button>`;
            break;
        case 'delivered':
            statusText = 'Entregado ✓';
            statusClass = 'status-delivered';
            nextButton = '';
            break;
    }

    statusSpan.textContent = `${statusText} • ${statusSpan.textContent.split('•')[1] || ''}`;
    statusSpan.className = `pedido-status ${statusClass}`;
    statusSpan.dataset.status = newStatus;
    card.dataset.status = newStatus;

    statusActions.innerHTML = nextButton;
    if (newStatus === 'delivered') {
        statusActions.classList.add('hidden');
    }

    updateStats();
    showNotification(`Pedido #PED-${String(pedidoId).padStart(3, '0')} actualizado a ${statusText}`, 'success');
}

// Actualizar estadísticas
function updateStats() {
    const pedidos = document.querySelectorAll('.pedido-card');
    let pending = 0, processing = 0, shipped = 0, delivered = 0;

    pedidos.forEach(pedido => {
        const status = pedido.dataset.status;
        switch (status) {
            case 'pending': pending++; break;
            case 'processing': processing++; break;
            case 'shipped': shipped++; break;
            case 'delivered': delivered++; break;
        }
    });

    document.getElementById('statPending').textContent = pending;
    document.getElementById('statProcessing').textContent = processing;
    document.getElementById('statShipped').textContent = shipped;
    document.getElementById('statDelivered').textContent = delivered;
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#2094f3'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Cargar datos al iniciar
loadProfileData();
updateStats();
