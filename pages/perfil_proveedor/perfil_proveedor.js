// Toggle Sidebar móvil
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Cargar datos del proveedor desde localStorage
function loadProveedorData() {
    const proveedorName = localStorage.getItem('proveedorName') || 'Proveedor de Servicios Eléctricos';
    const email = localStorage.getItem('proveedorEmail') || 'proveedor@rolapet.com';

    // Actualizar sidebar
    document.getElementById('sidebarProveedorName').textContent = proveedorName;
    document.getElementById('sidebarProveedorEmail').textContent = email;

    // Actualizar hero section
    document.getElementById('proveedorEmail').textContent = email;
}

// Cargar datos al iniciar
loadProveedorData();
