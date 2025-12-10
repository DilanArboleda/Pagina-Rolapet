import { api } from "../../../../js/utils/api-client.js";
import API from "../../../../js/utils/endpoints.js";
import { userService } from "../../../../js/services/user-service.js";

class MiPerfilComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="perfil-container">
                <!-- HERO SIMPLE -->
                <div class="hero-simple">
                    <div class="hero-avatar" id="heroAvatar"><i class="fa-solid fa-user"></i></div>
                    <div class="hero-text">
                        <h1 id="heroName">Cargando...</h1>
                        <p id="heroSubtitle">Usuario • Verificado</p>
                    </div>
                </div>

                <!-- CONTENIDO -->
                <div class="content-grid">
                    <div id="mainColumn">
                        <section class="section active-section">
                            <div class="card">
                                <h3><i class="fa-solid fa-id-card"></i> Mi Perfil</h3>
                                <div class="info-row"><strong>Nombre:</strong><small id="infoNombre" style="margin-left:8px;">--</small></div>
                                <div class="info-row"><strong>Correo:</strong><small id="infoCorreo" style="margin-left:8px;">--</small></div>
                                <div class="info-row"><strong>Teléfono:</strong><small id="infoTelefono" style="margin-left:8px;">--</small></div>
                                <div style="margin-top:14px;">
                                    <button class="btn-primary" id="editProfileBtn"><i class="fa-solid fa-pen"></i> Editar Perfil</button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- ASIDE -->
                    <aside>
                         <div class="card">
                            <h3>Resumen</h3>
                            <p style="margin:8px 0;"><strong id="summaryName">--</strong></p>
                            <p style="margin:6px 0; color:#6b7280;" id="summaryEmail">--</p>
                        </div>
                    </aside>
                </div>
            </div>
        `;

        this.loadUserInfo();

        this.querySelector('#editProfileBtn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('navigate-user', {
                detail: 'configuracion',
                bubbles: true,
                composed: true
            }));
        });
    }

    async loadUserInfo() {
        try {
            // 1. Obtener usuario actual del cache (auth)
            const cachedUser = userService.getFromCache();
            const userId = cachedUser?.user_id;

            if (!userId) {
                throw new Error('No se encontró el ID de usuario en cache');
            }

            // 2. Llamar al backend para obtener el perfil completo
            const response = await api.get(API.USER.FIND_BY_ID(userId));
            const user = response?.data || {};

            const nombre = `${user.nombre || ''} ${user.apellido_1 || ''} ${user.apellido_2 || ''}`.trim() || 'Usuario';
            const correo = user.email || cachedUser.email || 'Sin correo';
            const telefono = user.telefono || '+57 300 000 0000';

            this.querySelector('#heroName').textContent = nombre;
            this.querySelector('#infoNombre').textContent = nombre;
            this.querySelector('#infoCorreo').textContent = correo;
            this.querySelector('#infoTelefono').textContent = telefono;
            this.querySelector('#summaryName').textContent = nombre;
            this.querySelector('#summaryEmail').textContent = correo;
        } catch (error) {
            console.error('Error cargando información de perfil:', error);

            // Fallback simple si algo falla
            const nombre = 'Usuario';
            const correo = 'usuario@rolapet.com';
            const telefono = '+57 300 000 0000';

            this.querySelector('#heroName').textContent = nombre;
            this.querySelector('#infoNombre').textContent = nombre;
            this.querySelector('#infoCorreo').textContent = correo;
            this.querySelector('#infoTelefono').textContent = telefono;
            this.querySelector('#summaryName').textContent = nombre;
            this.querySelector('#summaryEmail').textContent = correo;
        }
    }
}

customElements.define('mi-perfil-component', MiPerfilComponent);
