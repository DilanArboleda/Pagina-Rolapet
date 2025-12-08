class RegistroVehiculosComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="perfil-container">
                 <div class="hero-simple">
                    <div class="hero-avatar"><i class="fa-solid fa-car-side"></i></div>
                    <div class="hero-text">
                        <h1>Registro de Vehículos</h1>
                        <p>Añade un nuevo vehículo a tu flota</p>
                    </div>
                </div>

                <div class="content-grid">
                    <div id="mainColumn">
                        <section class="section">
                            <div class="card">
                                <h3><i class="fa-solid fa-pen-to-square"></i> Nuevo Registro</h3>
                                <p>Para registrar un vehículo, necesitas completar el formulario oficial.</p>
                                <div style="margin-top:20px;">
                                    <!-- Assuming the path to registration form -->
                                    <a id="goRegisterBtn" class="btn-primary" href="/pages/registro_vehiculos/registro_vehiculos.html"><i class="fa-solid fa-external-link"></i> Ir al Formulario de Registro</a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('registro-vehiculos-component', RegistroVehiculosComponent);
