class PuntosInteresAdminComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }


    async connectedCallback() {
        try {
            const response = await fetch('/pages/gestion_usuarios_admin/components/punto-interes/puntos-interes-admin-component.html');
            const html = await response.text();

            const template = document.createElement('template');
            template.innerHTML = html;

            // Clear shadow root before appending (good practice if called multiple times)
            this.shadowRoot.innerHTML = '';

            // Add CSS link for Component styles
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', '/pages/gestion_usuarios_admin/components/punto-interes/puntos-interes-admin-component.css');
            this.shadowRoot.appendChild(link);

            // Add Leaflet CSS to Shadow DOM
            const leafletLink = document.createElement('link');
            leafletLink.setAttribute('rel', 'stylesheet');
            leafletLink.setAttribute('href', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
            this.shadowRoot.appendChild(leafletLink);

            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.setupEventListeners();

            // Initialize Map
            this.initMap();
        } catch (error) {
            console.error('Error loading puntos-interes-admin-component:', error);
        }
    }

    initMap() {
        // Wait for DOM
        setTimeout(() => {
            const mapContainer = this.shadowRoot.getElementById('map');
            if (!mapContainer) return;

            // Default to Bogotá or user location
            const map = L.map(mapContainer).setView([4.6097, -74.0817], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            this.map = map;

            // Fix for map not rendering correctly sometimes in hidden tabs/shadow dom
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }, 100);
    }

    setupEventListeners() {
        const createBtn = this.shadowRoot.querySelector('.create-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.crearNuevoPunto());
        }

        const editBtns = this.shadowRoot.querySelectorAll('.edit-btn');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.editarPunto(e.target));
        });

        const deleteBtns = this.shadowRoot.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.eliminarPunto(e.target));
        });
    }

    crearNuevoPunto() {
        alert('Crear Nuevo Punto - Logic to be implemented');
    }

    editarPunto(target) {
        // Find closest row to get data
        const row = target.closest('tr');
        const nombre = row ? row.dataset.nombre : 'Unknown';
        alert(`Editar punto: ${nombre}`);
    }

    eliminarPunto(target) {
        const row = target.closest('tr');
        if (row && confirm('¿Eliminar este punto?')) {
            row.remove();
        }
    }
}

//TODO:  cuadrarlo con puntos_inters_admin.js


customElements.define('puntos-interes-admin-component', PuntosInteresAdminComponent);