import { userService } from "../../../js/services/user-service.js";


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}
// Busqueda del nombre: 
let email = userService.getFromCache().email;

console.log(email);


// Asignar al DOM
document.getElementById('adminEmail').textContent =
    email || 'No está registrado';


// Autocompletar nombre/email igual que en el panel principal
document.getElementById('adminName').textContent =
    userService.getFromCache().name || 'Administrador';


// Filtro de búsqueda
document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll('.user-row').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
});



/*------ */
function openPanel() {
    document.getElementById('editPanel').classList.add('open');
}

function closePanel() {
    document.getElementById('editPanel').classList.remove('open');
}

function deleteUser(id) {
    const row = document.getElementById('user-' + id);
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
        row.remove();
    }
}

function openNewUserModal() {
    alert('Funcionalidad para nuevo usuario no implementada.');
}
