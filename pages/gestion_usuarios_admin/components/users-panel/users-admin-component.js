import { UserService } from "../../services/user-service.js";

class UsersAdminComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.userService = new UserService();
        this.users = [];
    }

    async connectedCallback() {
        try {
            const response = await fetch('/pages/gestion_usuarios_admin/components/users-panel/users-admin-component.html');
            const html = await response.text();

            const template = document.createElement('template');
            template.innerHTML = html;
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.initComponent();
        } catch (error) {
            console.error('Error loading users-admin-component:', error);
        }
    }

    initComponent() {
        this.loadUsers();
        this.setupEventListeners();
        this.setupSearch();
    }

    async loadUsers() {
        this.showLoading();
        try {
            this.users = await this.userService.getAllUsers();
            this.renderTable(this.users);
        } catch (error) {
            this.showError();
        }
    }

    renderTable(users) {
        const tableBody = this.shadowRoot.querySelector('table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (!users || users.length === 0) {
            this.showEmpty(tableBody);
            return;
        }

        users.forEach(user => {
            const tr = this.createUserRow(user);
            tableBody.appendChild(tr);
        });
    }

    createUserRow(user) {
        const tr = document.createElement('tr');
        tr.className = 'user-row';
        tr.id = `user-${user.id}`;

        const fullName = `${user.name || ''} ${user.apellido_1 || ''}`.trim() || 'Sin Nombre';
        const email = user.email || 'No disponible';
        const rol = user.rol || 'Usuario';
        const fechaAlta = user.fecha_alta || '-';
        const estado = user.estado || 'Activo';

        // Using data attributes to store ID for event delegation if needed, 
        // but adding listeners directly to icons is safer for Shadow DOM.
        tr.innerHTML = `
            <td data-label="Nombre de usuario">${fullName}</td>
            <td data-label="Correo electrónico">${email}</td>
            <td data-label="Rol">${rol}</td>
            <td data-label="Fecha de alta">${fechaAlta}</td>
            <td data-label="Estado"><span class="tag-active">${estado}</span></td>
            <td data-label="Acciones" class="actions">
                <i class="fa-solid fa-pen edit-btn" title="Editar"></i>
                <i class="fa-solid fa-trash delete-btn" title="Eliminar"></i>
            </td>
        `;

        const editBtn = tr.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => this.openPanel(user.id));

        const deleteBtn = tr.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.confirmDeleteUser(user.id));

        return tr;
    }

    showLoading() {
        const tableBody = this.shadowRoot.querySelector('table tbody');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Cargando usuarios...</td></tr>`;
        }
    }

    showError() {
        const tableBody = this.shadowRoot.querySelector('table tbody');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar usuarios</td></tr>`;
        }
    }

    showEmpty(tableBody) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay usuarios encontrados</td></tr>`;
    }

    setupEventListeners() {
        const btnNewUser = this.shadowRoot.getElementById('btnNewUser');
        const btnCancel = this.shadowRoot.getElementById('btnCancel');

        // Ensure buttons exist before adding listeners
        if (btnNewUser) {
            btnNewUser.addEventListener('click', () => this.openNewUserModal());
        }
        if (btnCancel) {
            btnCancel.addEventListener('click', () => this.closePanel());
        }
    }

    setupSearch() {
        const searchInput = this.shadowRoot.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const filter = e.target.value.toLowerCase();
                this.filterRows(filter);
            });
        }
    }

    filterRows(filter) {
        const rows = this.shadowRoot.querySelectorAll('.user-row');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    }

    openNewUserModal() {
        alert('Funcionalidad para nuevo usuario no implementada.');
    }

    openPanel(userId) {
        const panel = this.shadowRoot.getElementById('editPanel');
        if (panel) panel.classList.add('open');
    }

    closePanel() {
        const panel = this.shadowRoot.getElementById('editPanel');
        if (panel) panel.classList.remove('open');
    }

    async confirmDeleteUser(userId) {
        if (confirm('¿Seguro que deseas eliminar este usuario?')) {
            try {
                // await this.userService.deleteUser(userId); // Uncomment when ready to actually delete
                const row = this.shadowRoot.getElementById('user-' + userId);
                if (row) row.remove();
            } catch (error) {
                alert('Error al eliminar usuario');
            }
        }
    }
}

customElements.define('users-admin-component', UsersAdminComponent);
