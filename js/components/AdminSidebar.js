
export function renderSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Determine current path to set active class
    const currentPath = window.location.pathname;

    // Helper to check if link is active
    const isActive = (path) => currentPath.includes(path) ? 'active' : '';

    const html = `
    <aside class="sidebar" id="sidebar">
      <div class="profile">
        <img src="/images/it_service/administracion.png" alt="Admin" />
        <h3 id="adminName">Administrador</h3>
        <small id="adminEmail"></small>
      </div>

      <nav>
        <a href="/pages/gestion_usuarios_admin/gestion_usuarios_Admin.html" class="${isActive('gestion_usuarios_Admin.html')}">
            <i class="fa-solid fa-users"></i> Gestión de Usuarios
        </a>
        <a href="/pages/gestion_usuarios_admin/components/moderacion-admin/moderacion_Admin.html" class="${isActive('moderacion_Admin.html')}">
            <i class="fa-solid fa-shield-halved"></i> Moderación
        </a>
        <a href="/pages/gestion_usuarios_admin/components/punto-interes/puntos_interes_Admin.html" class="${isActive('puntos_interes_Admin.html')}">
            <i class="fa-solid fa-location-dot"></i> Puntos de Interés
        </a>
        <a href="/pages/gestion_usuarios_admin/components/proveedores/gestion_proveedores_Admin.html" class="${isActive('gestion_proveedores_Admin.html')}">
            <i class="fa-solid fa-truck"></i> Proveedores
        </a>
        <a href="/pages/gestion_usuarios_admin/components/configuracion/configuracion_admin.html" class="${isActive('configuracion_admin.html')}">
            <i class="fa-solid fa-gear"></i> Configuración
        </a>
      </nav>

      <a class="logout-btn" href="/index.html">
        <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
      </a>
    </aside>
    `;

    container.innerHTML = html;
}
