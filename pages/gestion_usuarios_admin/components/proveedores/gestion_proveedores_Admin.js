// Imports
import { SidebarManager } from '../../../../js/components/SidebarManager.js';
import { PanelManager } from '../../../../js/components/PanelManager.js';
import { loadUserDataToUI } from '../../../../js/utils/ui-helpers.js';
import { getInputValue } from '../../../../js/utils/dom-helpers.js';

// Inicialización de componentes
const sidebar = new SidebarManager();
const panel = new PanelManager('panel', {
    titleElementId: 'panelTitle',
    formInputIds: [] // El formulario se maneja manualmente
});

// Cargar datos del usuario
document.addEventListener("DOMContentLoaded", () => {
    loadUserDataToUI({ nameId: 'adminName', emailId: 'adminEmail' });
});

// ============================================
// FUNCIONES DE PANEL
// ============================================

/**
 * Abrir panel para nuevo proveedor
 */
window.openPanel = function () {
    panel.open('Nuevo Proveedor');
    document.getElementById("providerForm").reset();
};

/**
 * Cerrar panel
 */
window.closePanel = function () {
    panel.close();
};

/**
 * Editar proveedor
 */
window.editProvider = function (btn) {
    const row = btn.closest("tr");
    const cells = row.getElementsByTagName("td");

    panel.open('Editar Proveedor');

    const form = document.getElementById("providerForm");
    form.nombre.value = cells[0].textContent;
    form.servicio.value = cells[1].textContent;
    form.estado.value = cells[2].textContent;
};

/**
 * Eliminar proveedor
 */
window.deleteProvider = function (btn) {
    if (confirm("¿Eliminar este proveedor?")) {
        btn.closest("tr").remove();
    }
};

// ============================================
// FILTROS
// ============================================

/**
 * Filtrar tabla de proveedores
 */
window.filterTable = function () {
    const search = getInputValue("searchInput").toLowerCase();
    const status = getInputValue("statusFilter");
    const rows = document.querySelectorAll("#providerTable tbody tr");

    rows.forEach(row => {
        const name = row.children[0].textContent.toLowerCase();
        const state = row.children[2].textContent;

        const matchSearch = name.includes(search);
        const matchStatus = !status || state === status;

        row.style.display = matchSearch && matchStatus ? "" : "none";
    });
};

// Configurar listeners de filtros
document.getElementById('searchInput')?.addEventListener('input', filterTable);
document.getElementById('statusFilter')?.addEventListener('change', filterTable);