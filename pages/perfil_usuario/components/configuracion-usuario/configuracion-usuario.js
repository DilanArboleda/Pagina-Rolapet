class ConfiguracionUsuarioComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="perfil-container">
                 <div class="hero-simple" style="background: linear-gradient(135deg, #607d8b, #455a64);">
                    <div class="hero-avatar"><i class="fa-solid fa-gear"></i></div>
                    <div class="hero-text">
                        <h1>Configuración</h1>
                        <p>Actualiza tus datos y privacidad</p>
                    </div>
                </div>

                <div class="content-grid">
                    <div id="mainColumn">
                        <section class="section">
                            <div class="card">
                                <h3><i class="fa-solid fa-user-pen"></i> Editar Información</h3>
                                <form id="profileForm">
                                    <div style="display:flex; flex-direction:column; gap:8px;">
                                        <label>Nombre completo</label>
                                        <input id="inputNombre" class="form-control" type="text" required>

                                        <label>Correo</label>
                                        <input id="inputCorreo" class="form-control" type="email" required>

                                        <label>Teléfono</label>
                                        <input id="inputTelefono" class="form-control" type="text">

                                        <div style="display:flex; gap:8px; margin-top:8px;">
                                            <button class="btn-primary" type="submit"><i class="fa-solid fa-save"></i> Guardar cambios</button>
                                            <button type="button" class="btn-outline" id="togglePasswordBtn"><i class="fa-solid fa-lock"></i> Cambiar contraseña</button>
                                        </div>
                                    </div>
                                </form>

                                <div id="passwordBlock" style="display:none; margin-top:20px; border-top:1px solid #eee; padding-top:20px;">
                                    <h3><i class="fa-solid fa-lock"></i> Seguridad</h3>
                                    <form id="passwordForm">
                                        <div style="display:flex; flex-direction:column; gap:8px;">
                                            <label>Contraseña actual</label>
                                            <input id="currentPassword" class="form-control" type="password" required>
                                            <label>Nueva contraseña</label>
                                            <input id="newPassword" class="form-control" type="password" required>
                                            <div style="margin-top:8px;">
                                                <button class="btn-primary" type="submit" style="background:#d32f2f;"><i class="fa-solid fa-key"></i> Actualizar contraseña</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        `;

        this.loadUserInfo();
        this.setupEvents();
    }

    loadUserInfo() {
        const nombre = localStorage.getItem('userName') || 'Usuario de Prueba';
        const correo = localStorage.getItem('userEmail') || 'usuario@rolapet.com';
        const telefono = localStorage.getItem('userPhone') || '+57 300 000 0000';

        this.querySelector('#inputNombre').value = nombre;
        this.querySelector('#inputCorreo').value = correo;
        this.querySelector('#inputTelefono').value = telefono;
    }

    setupEvents() {
        this.querySelector('#profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = this.querySelector('#inputNombre').value;
            const correo = this.querySelector('#inputCorreo').value;
            const telefono = this.querySelector('#inputTelefono').value;

            localStorage.setItem('userName', nombre);
            localStorage.setItem('userEmail', correo);
            localStorage.setItem('userPhone', telefono);

            alert('Cambios guardados exitosamente');
            // Notify sidebar to update? The page reload will do it, or we could dispatch an event.
            // Component reload logic isn't sophisticated here, so let's just alert.
        });

        this.querySelector('#togglePasswordBtn').addEventListener('click', () => {
            const block = this.querySelector('#passwordBlock');
            block.style.display = block.style.display === 'none' ? 'block' : 'none';
        });

        this.querySelector('#passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Contraseña actualizada (simulado)');
            this.querySelector('#passwordForm').reset();
            this.querySelector('#passwordBlock').style.display = 'none';
        });
    }
}

customElements.define('configuracion-usuario-component', ConfiguracionUsuarioComponent);
