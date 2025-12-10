import { poiService } from "../../../../js/services/poi-service.js";
import { MapService } from "../../../../js/services/map-service.js";

class PuntosInteresAdminComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.pois = [];
        this.filteredPois = [];
        this.map = null;
        this.mapService = new MapService();
        this.markersLayer = null;
        this.previewMarker = null;
        this.lastSearchedAddress = null;
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

            // Cache elements
            this.tableBody = this.shadowRoot.querySelector('#puntosTable tbody');
            this.searchInput = this.shadowRoot.getElementById('searchInput');
            this.searchButton = this.shadowRoot.getElementById('searchAddressBtn');

            this.setupEventListeners();

            // Initialize Map
            this.initMap();

            // Cargar POIs
            await this.loadPOIs();
        } catch (error) {
            console.error('Error loading puntos-interes-admin-component:', error);
        }
    }

    initMap() {
        // Wait for DOM
        setTimeout(() => {
            const mapContainer = this.shadowRoot.getElementById('map');
            if (!mapContainer) return;

            const map = L.map(mapContainer).setView([4.6097, -74.0817], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: ' OpenStreetMap'
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

        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                this.filteredPois = this.pois.filter(p => {
                    const nombre = (p.nombre || '').toLowerCase();
                    const direccion = (p.direccionCompleta || '').toLowerCase();
                    return nombre.includes(term) || direccion.includes(term);
                });
                this.renderTable();
            });
        }

        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => this.buscarDireccion());
        }
    }

    async buscarDireccion() {
        if (!this.map || !this.searchInput) return;

        const address = this.searchInput.value.trim();
        if (!address) {
            alert('Ingresa una dirección para buscar en el mapa.');
            return;
        }

        try {
            const result = await this.mapService.geocodeAddress(address);
            if (!result || !result.lat || !result.lng) {
                alert('No se pudo localizar la dirección.');
                return;
            }

            this.lastSearchedAddress = address;

            if (this.previewMarker) {
                this.map.removeLayer(this.previewMarker);
            }

            this.previewMarker = L.marker([result.lat, result.lng]).addTo(this.map)
                .bindPopup(`
                    <strong>Ubicación propuesta</strong><br>
                    <span>${address}</span>
                `)
                .openPopup();

            this.map.setView([result.lat, result.lng], 15);
        } catch (error) {
            console.error('Error al buscar dirección:', error);
            alert('Ocurrió un error al buscar la dirección.');
        }
    }

    async loadPOIs() {
        if (!this.tableBody) return;

        this.showLoadingRow();

        try {
            const pois = await poiService.getAllPOIs();
            this.pois = pois || [];
            this.filteredPois = this.pois;
            this.renderTable();
            this.renderMarkers();
        } catch (error) {
            console.error('Error al cargar POIs en admin:', error);
            this.showErrorRow();
        }
    }

    showLoadingRow() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">Cargando puntos de interés...</td>
            </tr>
        `;
    }

    showErrorRow() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color:#d32f2f;">Error al cargar puntos de interés</td>
            </tr>
        `;
    }

    showEmptyRow() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color:var(--medium-gray);">No hay puntos de interés registrados</td>
            </tr>
        `;
    }

    renderTable() {
        if (!this.tableBody) return;

        this.tableBody.innerHTML = '';

        if (!this.filteredPois || this.filteredPois.length === 0) {
            this.showEmptyRow();
            return;
        }

        this.filteredPois.forEach(poi => {
            const tr = document.createElement('tr');
            tr.dataset.id = poi.id;
            tr.dataset.nombre = poi.nombre;
            tr.dataset.descripcion = poi.descripcion || '';
            tr.dataset.direccion = poi.direccionCompleta || '';

            const categoria = poi.categoria || 'N/A';
            const estado = poi.estado || 'Activo';

            tr.innerHTML = `
                <td data-label="Nombre">${poi.nombre || 'Sin nombre'}</td>
                <td data-label="Categoría">${categoria}</td>
                <td data-label="Estado">${estado}</td>
                <td data-label="Acciones" class="actions">
                    <button class="edit-btn" type="button">Editar</button>
                    <button class="delete-btn" type="button">Eliminar</button>
                </td>
            `;

            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');

            if (editBtn) editBtn.addEventListener('click', () => this.editarPunto(tr));
            if (deleteBtn) deleteBtn.addEventListener('click', () => this.eliminarPunto(tr));

            this.tableBody.appendChild(tr);
        });
    }

    async renderMarkers() {
        if (!this.map || !this.pois || this.pois.length === 0) return;

        if (this.markersLayer) {
            this.map.removeLayer(this.markersLayer);
        }

        this.markersLayer = L.layerGroup().addTo(this.map);

        for (const poi of this.pois) {
            if (!poi.direccionCompleta) continue;

            try {
                const geocodeResult = await this.mapService.geocodeAddress(poi.direccionCompleta);
                if (!geocodeResult || !geocodeResult.lat || !geocodeResult.lng) continue;

                const marker = L.marker([geocodeResult.lat, geocodeResult.lng]).addTo(this.markersLayer);
                marker.bindPopup(`
                    <strong>${poi.nombre || 'Sin nombre'}</strong><br>
                    <span>${poi.descripcion || 'Sin descripción'}</span><br>
                    <small>${poi.direccionCompleta}</small>
                `);
            } catch (error) {
                console.error('Error geocodificando dirección de POI:', poi.direccionCompleta, error);
            }
        }
    }

    async crearNuevoPunto() {
        const nombre = prompt('Nombre del punto de interés:');
        if (!nombre) return;

        const descripcion = prompt('Descripción del punto de interés (opcional):') || '';
        let direccionCompleta = this.searchInput.value;

        const dto = {
            nombre,
            descripcion,
            imgPun: "https://ejemplo.com/imagenes/parque-simon-bolivar.jpg",
            direccion: {
                viaPrincipal: "",
                numeroVia: "",
                letraUno: "",
                bis: false,
                cardinalidadUno: "",
                numeroUno: "",
                letraDos: "",
                cardinalidadDos: "",
                numeroDos: "",
                complemento: "",
                direccionCompleta
            }
        };
        
            console.log("el dto: ",dto)
        try {
            const creado = await poiService.createPOI(dto);

            // Actualizar lista local
            this.pois.push(creado || dto);
            this.filteredPois = this.pois;
            this.renderTable();
            this.renderMarkers();
            alert('Punto de interés creado correctamente');
        } catch (error) {
            console.error('Error al crear punto de interés:', error);
            alert('No se pudo crear el punto de interés');
        }
    }

    editarPunto(row) {
        const nombre = row?.dataset.nombre || 'Desconocido';
        alert(`Editar punto: ${nombre} (pendiente de implementación)`);
    }

    eliminarPunto(row) {
        const nombre = row?.dataset.nombre || '';
        if (!row) return;

        if (confirm(`¿Eliminar el punto de interés "${nombre}"? (solo se elimina en UI por ahora)`)) {
            row.remove();
        }
    }
}

//TODO:  cuadrarlo con puntos_inters_admin.js


customElements.define('puntos-interes-admin-component', PuntosInteresAdminComponent);