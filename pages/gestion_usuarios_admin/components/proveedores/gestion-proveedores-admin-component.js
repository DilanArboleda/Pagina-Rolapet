class GestionProveedoresAdminComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        try {
            const response = await fetch('/pages/gestion_usuarios_admin/components/proveedores/gestion-proveedores-admin-component.html');
            const html = await response.text();

            const template = document.createElement('template');
            template.innerHTML = html;

            this.shadowRoot.innerHTML = '';

            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', '/pages/gestion_usuarios_admin/components/proveedores/gestion-proveedores-admin-component.css');
            this.shadowRoot.appendChild(link);

            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading gestion-proveedores-admin-component:', error);
        }
    }

    setupEventListeners() {
        const createBtn = this.shadowRoot.querySelector('.btn-primary');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.openPanel());
        }

        const searchInput = this.shadowRoot.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', () => this.filterTable());
        }

        const statusFilter = this.shadowRoot.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterTable());
        }

        const editBtns = this.shadowRoot.querySelectorAll('.btn-warning');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.editProvider(e.target));
        });

        const deleteBtns = this.shadowRoot.querySelectorAll('.btn-danger');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteProvider(e.target));
        });
    }

    openPanel() {
        alert('Abrir panel de Nuevo Proveedor (Lógica pendiente de integrar con PanelManager)');
    }

    editProvider(target) {
        const row = target.closest('tr');
        const providerName = row.querySelector('[data-label="Proveedor"]').textContent;
        alert(`Editar proveedor: ${providerName}`);
    }

    deleteProvider(target) {
        if (confirm("¿Eliminar este proveedor?")) {
            target.closest("tr").remove();
        }
    }

    filterTable() {
        const searchInput = this.shadowRoot.getElementById('searchInput');
        const statusFilter = this.shadowRoot.getElementById('statusFilter');

        const search = searchInput ? searchInput.value.toLowerCase() : '';
        const status = statusFilter ? statusFilter.value : '';

        const rows = this.shadowRoot.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const nameCell = row.querySelector('[data-label="Proveedor"]');
            const statusCell = row.querySelector('[data-label="Estado"]');

            const name = nameCell ? nameCell.textContent.toLowerCase() : '';
            const state = statusCell ? statusCell.textContent : '';

            const matchSearch = name.includes(search);
            const matchStatus = !status || state === status;

            row.style.display = matchSearch && matchStatus ? "" : "none";
        });
    }
}

customElements.define('gestion-proveedores-admin-component', GestionProveedoresAdminComponent);