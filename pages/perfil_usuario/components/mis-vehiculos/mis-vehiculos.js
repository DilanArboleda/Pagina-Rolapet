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

    loadVehicles() {
        const container = this.querySelector('#vehiclesList');
        // Example data
        const exampleVehicles = [
            { id: 'v1', title: 'Moto eléctrica ZX100', image: '/images/it_service/producto1.png', details: '2019 • 150km' },
            { id: 'v2', title: 'Bici cargo B-200', image: '/images/it_service/producto2.png', details: '2021 • 50km' }
        ];

        // Timeout to simulate fetch
        setTimeout(() => {
            this.renderVehicles(exampleVehicles, container);
        }, 300);
    }

    renderVehicles(vehicles, container) {
        if (!vehicles || vehicles.length === 0) {
            container.innerHTML = '<p style="color:#6b7280;">No tienes vehículos registrados.</p>';
            return;
        }
        container.innerHTML = '';
        vehicles.forEach(v => {
            const card = document.createElement('div');
            card.style = 'display:flex; gap:12px; align-items:center; margin-bottom:12px; padding:10px; background:white; border-radius:10px; border:1px solid #eef2f7;';
            const img = document.createElement('img');
            img.src = v.image || '/images/default_vehicle.png';
            img.alt = v.title;
            img.style = 'width:84px; height:64px; object-fit:cover; border-radius:8px;';

            const body = document.createElement('div');
            body.style = 'flex:1';
            body.innerHTML = `<strong>${v.title}</strong><div style="color:#6b7280; font-size:13px; margin-top:6px;">${v.details || ''}</div>`;

            const actions = document.createElement('div');
            actions.innerHTML = `
                <button class="btn-outline" style="margin-right:6px;" data-action="view" data-id="${v.id}"><i class="fa-solid fa-eye"></i></button>
                <button class="btn-outline" data-action="delete" data-id="${v.id}"><i class="fa-solid fa-trash"></i></button>
            `;

            card.appendChild(img);
            card.appendChild(body);
            card.appendChild(actions);
            container.appendChild(card);

            // Add event listeners to buttons
            card.querySelector('[data-action="view"]').addEventListener('click', () => alert(`Ver vehículo: ${v.id}`));
            card.querySelector('[data-action="delete"]').addEventListener('click', () => {
                if (confirm('¿Eliminar este vehículo?')) alert(`Vehículo ${v.id} eliminado (simulado)`);
            });
        });
    }
}

customElements.define('mis-vehiculos-component', MisVehiculosComponent);
