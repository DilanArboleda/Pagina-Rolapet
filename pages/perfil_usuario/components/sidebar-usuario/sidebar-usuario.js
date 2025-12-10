import { userService } from "../../../../js/services/user-service.js";

class SidebarUsuarioComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <aside class="sidebar" id="sidebar">
                <div class="profile">
                    <div class="profile-avatar" id="avatarLetter">U</div>
                    <h3 id="userName">Cargando...</h3>
                    <small id="userEmail">...</small>
                </div>

                <nav>
                    <a href="#" data-view="mi-perfil" class="active"><i class="fa-solid fa-user"></i> Mi Perfil</a>
                    <a href="#" data-view="registro-vehiculos"><i class="fa-solid fa-car-side"></i> Registro de Vehículos</a>
                    <a href="#" data-view="mis-vehiculos"><i class="fa-solid fa-car"></i> Mis Vehículos</a>
                    <a href="#" data-view="configuracion"><i class="fa-solid fa-gear"></i> Configuración</a>
                </nav>

                <a class="logout-btn" href="/pages/home_usuario/home_usuario.html" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Volver al inicio</a>
            </aside>
        `;

        this.setupEvents();
        this.loadUserInfo();
    }

    setupEvents() {
        const links = this.querySelectorAll('nav a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Update active state
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Dispatch event
                const view = link.getAttribute('data-view');
                this.dispatchEvent(new CustomEvent('navigate-user', {
                    detail: view,
                    bubbles: true,
                    composed: true
                }));
            });
        });

        const logoutBtn = this.querySelector('#logoutBtn');
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userId');
            // Assuming default flow, href handles redirection
        });
    }

    loadUserInfo() {
        try {
            const cachedUser = userService.getFromCache();

            const nombreCompleto = `${cachedUser?.nombre || ''} ${cachedUser?.apellido1 || ''}`.trim();
            const correo = cachedUser?.email || 'usuario@rolapet.com';

            const nombreParaMostrar = nombreCompleto || correo.split('@')[0] || 'Usuario';

            this.querySelector('#userName').textContent = nombreParaMostrar;
            this.querySelector('#userEmail').textContent = correo;
            this.querySelector('#avatarLetter').textContent = nombreParaMostrar.charAt(0).toUpperCase();
        } catch (error) {
            const nombre = 'Usuario';
            const correo = 'usuario@rolapet.com';

            this.querySelector('#userName').textContent = nombre;
            this.querySelector('#userEmail').textContent = correo;
            this.querySelector('#avatarLetter').textContent = nombre.charAt(0).toUpperCase();
        }
    }

    toggleSidebar() {
        const sidebar = this.querySelector('#sidebar');
        if (sidebar) sidebar.classList.toggle('open');
    }
}

customElements.define('sidebar-usuario', SidebarUsuarioComponent);
