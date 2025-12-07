// Toggle Sidebar móvil
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Cargar datos desde localStorage
function loadProfileData() {
    const proveedorName = localStorage.getItem('proveedorName') || 'Proveedor de Servicios Eléctricos';
    const email = localStorage.getItem('proveedorEmail') || 'proveedor@ejemplo.com';
    const phone = localStorage.getItem('proveedorPhone') || '+57 300 123 4567';
    const website = localStorage.getItem('proveedorWebsite') || 'www.proveedor.com';
    const description = localStorage.getItem('proveedorDescription') || 'Proveedor especializado en servicios y productos para el mantenimiento de scooters y bicicletas eléctricas. Más de 10 años de experiencia ofreciendo soluciones de calidad.';
    const location = localStorage.getItem('proveedorLocation') || 'Bogotá, Colombia';
    const subtitle = localStorage.getItem('proveedorSubtitle') || 'Especialista en mantenimiento y accesorios';

    // Sidebar
    document.getElementById('sidebarProveedorName').textContent = proveedorName;
    document.getElementById('sidebarProveedorEmail').textContent = email;

    // Header
    document.getElementById('displayProveedorName').textContent = proveedorName;
    document.getElementById('displayLocation').innerHTML = '<i class="fa-solid fa-location-dot" style="font-size: 16px; vertical-align: middle; color: #666;"></i> ' + location;
    document.getElementById('displaySubtitle').textContent = subtitle;

    // Detalles
    document.getElementById('displayEmail').textContent = email;
    document.getElementById('editEmail').value = email;
    document.getElementById('displayPhone').textContent = phone;
    document.getElementById('editPhone').value = phone;
    document.getElementById('displayWebsite').textContent = website;
    document.getElementById('editWebsite').value = website;
    document.getElementById('displayDescription').textContent = description;
    document.getElementById('editDescription').value = description;
}

// Toggle modo edición
function toggleEditMode() {
    const detailValues = document.querySelectorAll('.detail-value');
    const detailInputs = document.querySelectorAll('.detail-input');
    const editActions = document.getElementById('editActions');
    const editBtn = document.getElementById('editToggleBtn');

    detailValues.forEach(value => value.style.display = 'none');
    detailInputs.forEach(input => input.style.display = 'block');
    editActions.classList.add('show');
    editBtn.style.display = 'none';
}

// Cancelar edición
function cancelEdit() {
    const detailValues = document.querySelectorAll('.detail-value');
    const detailInputs = document.querySelectorAll('.detail-input');
    const editActions = document.getElementById('editActions');
    const editBtn = document.getElementById('editToggleBtn');

    detailValues.forEach(value => value.style.display = 'block');
    detailInputs.forEach(input => input.style.display = 'none');
    editActions.classList.remove('show');
    editBtn.style.display = 'flex';
    loadProfileData(); // Recargar datos originales
}

// Guardar cambios
function saveChanges() {
    const proveedorName = document.getElementById('displayProveedorName').textContent;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const website = document.getElementById('editWebsite').value;
    const description = document.getElementById('editDescription').value;
    const location = document.getElementById('displayLocation').textContent.replace(/<[^>]*>/g, '').trim();
    const subtitle = document.getElementById('displaySubtitle').textContent;

    // Guardar en localStorage
    localStorage.setItem('proveedorName', proveedorName);
    localStorage.setItem('proveedorEmail', email);
    localStorage.setItem('proveedorPhone', phone);
    localStorage.setItem('proveedorWebsite', website);
    localStorage.setItem('proveedorDescription', description);
    localStorage.setItem('proveedorLocation', location);
    localStorage.setItem('proveedorSubtitle', subtitle);

    // Mostrar éxito
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
        successMsg.style.display = 'none';
        cancelEdit(); // Salir de modo edición
    }, 2000);
}

// Cargar datos al iniciar
loadProfileData();
