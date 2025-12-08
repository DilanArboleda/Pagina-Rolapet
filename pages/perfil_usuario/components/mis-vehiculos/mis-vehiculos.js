import API from '../../../../js/utils/endpoints.js';
import { api } from '../../../../js/utils/api-client.js';
import { userService } from '../../../../js/services/user-service.js';

class MisVehiculosComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="perfil-container">
                 <div class="hero-simple">
                    <div class="hero-avatar"><i class="fa-solid fa-car"></i></div>
                    <div class="hero-text">
                        <h1>Mis Vehículos</h1>
                        <p>Gestiona tu flota registrada</p>
                    </div>
                </div>

                <div class="content-grid">
                    <div id="mainColumn">
                        <section class="section">
                            <div class="card">
                                <h3><i class="fa-solid fa-list"></i> Lista de Vehículos</h3>
                                <div id="vehiclesList">
                                    <p style="color:#6b7280;">Cargando vehículos...</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        `;

        this.loadVehicles();
    }

    async loadVehicles() {
        const container = this.querySelector('#vehiclesList');

        try {
            const user = userService.getFromCache();
            if (!user || (!user.user_id && !user.id)) {
                container.innerHTML = '<p style="color:#d32f2f;">Error: No has iniciado sesión correctamente.</p>';
                return;
            }

            const userId = user.user_id || user.id;

            const response = await api.get(API.VEHICULO.GET_VEHICULOS_BY_USUARIO_ID(userId));

            // Response structure: { status: "success", data: [...], ... }
            let vehicles = [];
            if (response && response.data && Array.isArray(response.data)) {
                vehicles = response.data;
            } else if (Array.isArray(response)) {
                // Fallback in case raw array is returned
                vehicles = response;
            }

            this.renderVehicles(vehicles, container);

        } catch (error) {
            console.error("Error loading vehicles:", error);
            container.innerHTML = '<p style="color:#d32f2f;">Ocurrió un error al cargar tus vehículos. Por favor intenta más tarde.</p>';
        }
    }

    renderVehicles(vehicles, container) {
        if (!vehicles || vehicles.length === 0) {
            container.innerHTML = '<p style="color:#6b7280;">No tienes vehículos registrados asociadas a esta cuenta.</p>';
            return;
        }
        container.innerHTML = '';
        vehicles.forEach(v => {
            const card = document.createElement('div');
            card.style = 'display:flex; gap:12px; align-items:center; margin-bottom:12px; padding:10px; background:white; border-radius:10px; border:1px solid #eef2f7;';

            // As per provided JSON: { id: 1, matricula: "ABC123", idUsuario: 1 }
            const imgUrl = '/images/default_vehicle.png';

            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = v.matricula || 'Vehículo';
            img.style = 'width:84px; height:64px; object-fit:cover; border-radius:8px;';

            const title = v.matricula ? `Matrícula: ${v.matricula}` : 'Vehículo sin matrícula';
            const subtext = `ID Vehículo: ${v.id}`;

            const body = document.createElement('div');
            body.style = 'flex:1';
            body.innerHTML = `<strong>${title}</strong><div style="color:#6b7280; font-size:13px; margin-top:6px;">${subtext}</div>`;

            const actions = document.createElement('div');
            actions.innerHTML = `
                <button class="btn-outline" style="margin-right:6px;" data-action="view" data-id="${v.id}"><i class="fa-solid fa-eye"></i></button>
                <button class="btn-outline" data-action="delete" data-id="${v.id}"><i class="fa-solid fa-trash"></i></button>
            `;

            card.appendChild(img);
            card.appendChild(body);
            card.appendChild(actions);
            container.appendChild(card);

            card.querySelector('[data-action="view"]').addEventListener('click', () => {
                alert(`Detalles del vehículo: ${v.matricula} (ID: ${v.id})`);
            });
            card.querySelector('[data-action="delete"]').addEventListener('click', () => {
                if (confirm(`¿Eliminar vehículo ${v.matricula}?`)) {
                    alert(`Eliminar (simulado) para ID ${v.id}`);
                }
            });
        });
    }
}

customElements.define('mis-vehiculos-component', MisVehiculosComponent);
