import { api } from "@api";
import API from "@endpoints";

class ModeracionAdminComponent extends HTMLElement {
    constructor() {
        super();
        this.users = [];
        this.filteredUsers = [];
    }

    async connectedCallback() {
        const html = await fetch('/pages/gestion_usuarios_admin/components/moderacion-admin/moderacion-admin-component.html').then(response => response.text());
        const template = document.createElement('template');
        template.innerHTML = html;
        this.appendChild(template.content.cloneNode(true));

        this.initModeracion();
    }

    async initModeracion() {
        this.searchInput = this.querySelector('#searchInput');
        this.listContainer = this.querySelector('#moderacion-list');

        this.setupSearch();
        await this.loadUsers();
    }

    async loadUsers() {
        if (!this.listContainer) return;

        this.showLoading();

        try {
            const response = await api.get(API.USER.FIND_ALL_MODERACION);
            const users = response?.data || [];
            this.users = users;
            this.filteredUsers = users;
            this.renderUsers();
        } catch (error) {
            console.error('Error al cargar usuarios para moderación:', error);
            this.showError();
        }
    }

    setupSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            this.filteredUsers = this.users.filter(u => {
                const nombreCompleto = `${u.nombre || ''} ${u.apellido_1 || ''} ${u.apellido_2 || ''}`.toLowerCase();
                const email = (u.email || '').toLowerCase();
                return nombreCompleto.includes(term) || email.includes(term);
            });
            this.renderUsers();
        });
    }

    showLoading() {
        this.listContainer.innerHTML = `
            <div class="card mod-row" style="justify-content: center;">
                Cargando usuarios para moderación...
            </div>
        `;
    }

    showError() {
        this.listContainer.innerHTML = `
            <div class="card mod-row" style="justify-content: center; color: #d32f2f;">
                Error al cargar usuarios para moderación
            </div>
        `;
    }

    showEmpty() {
        this.listContainer.innerHTML = `
            <div class="card mod-row" style="justify-content: center; color: var(--medium-gray);">
                No hay usuarios para moderar
            </div>
        `;
    }

    renderUsers() {
        if (!this.listContainer) return;

        this.listContainer.innerHTML = '';

        if (!this.filteredUsers || this.filteredUsers.length === 0) {
            this.showEmpty();
            return;
        }

        this.filteredUsers.forEach(user => {
            const card = this.createUserCard(user);
            this.listContainer.appendChild(card);
        });
    }

    createUserCard(user) {
        const div = document.createElement('div');
        div.className = 'card mod-row';

        const nombreCompleto = `${user.nombre || ''} ${user.apellido_1 || ''} ${user.apellido_2 || ''}`.trim() || 'Sin nombre';
        const email = user.email || 'Sin correo';
        const strikes = typeof user.strikes === 'number' ? user.strikes : 0;

        const avatarUrl = `https://i.pravatar.cc/60?u=${encodeURIComponent(email || nombreCompleto)}`;

        div.innerHTML = `
            <img src="${avatarUrl}" alt="Usuario" />
            <div class="text">
                <strong>${nombreCompleto}</strong><br>
                <span>${email}</span><br>
                <span>Strikes: <strong>${strikes}</strong></span>
            </div>
            <div class="actions">
                <button class="btn-edit" type="button">Ver detalle</button>
                <button class="btn-reject" type="button">Suspender</button>
                <button class="btn-approve" type="button">Quitar strike</button>
            </div>
        `;

        return div;
    }
}

customElements.define('moderacion-admin-component', ModeracionAdminComponent);

// TODO- Ver si moderacion_admin.js sirve de algo