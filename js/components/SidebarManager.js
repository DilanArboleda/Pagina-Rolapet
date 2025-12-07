/**
 * SidebarManager - Clase para gestionar sidebar de navegación
 */

export class SidebarManager {
    /**
     * @param {string} sidebarId - ID del elemento sidebar
     */
    constructor(sidebarId = 'sidebar') {
        this.sidebarId = sidebarId;
        this.sidebar = null;
        this.init();
    }

    /**
     * Inicializar el sidebar
     */
    init() {
        this.sidebar = document.getElementById(this.sidebarId);
        if (!this.sidebar) {
            console.warn(`Sidebar con ID '${this.sidebarId}' no encontrado`);
        }
    }

    /**
     * Toggle del sidebar (abrir/cerrar)
     */
    toggle() {
        if (this.sidebar) {
            this.sidebar.classList.toggle('open');
        }
    }

    /**
     * Abrir el sidebar
     */
    open() {
        if (this.sidebar) {
            this.sidebar.classList.add('open');
        }
    }

    /**
     * Cerrar el sidebar
     */
    close() {
        if (this.sidebar) {
            this.sidebar.classList.remove('open');
        }
    }

    /**
     * Verificar si el sidebar está abierto
     * @returns {boolean}
     */
    isOpen() {
        return this.sidebar ? this.sidebar.classList.contains('open') : false;
    }
}

// Función global para compatibilidad con código existente
window.toggleSidebar = function () {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
};
