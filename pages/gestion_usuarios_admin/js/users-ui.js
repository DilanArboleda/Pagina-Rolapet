export function exposeUIFunctions() {
    // Sidebar
    window.toggleSidebar = function () {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    }

    // Panel de edición
    window.openPanel = function () {
        document.getElementById('editPanel').classList.add('open');
    }

    window.closePanel = function () {
        document.getElementById('editPanel').classList.remove('open');
    }

    // Eliminar usuario
    window.deleteUser = function (id) {
        const row = document.getElementById('user-' + id);
        if (confirm('¿Seguro que deseas eliminar este usuario?')) {
            row.remove();
            // TODO: Call API to delete user
            // api.delete(`${API.USER.DELETE}/${id}`);
        }
    }

    // Nuevo usuario
    window.openNewUserModal = function () {
        alert('Funcionalidad para nuevo usuario no implementada.');
    }
}