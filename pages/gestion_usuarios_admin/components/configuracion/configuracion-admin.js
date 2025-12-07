// Imports
import { SidebarManager } from '../../../../js/components/SidebarManager.js';
import { PanelManager } from '../../../../js/components/PanelManager.js';
import { loadUserDataToUI, setupSearchFilter } from '../../../../js/utils/ui-helpers.js';
import { getInputValue } from '../../../../js/utils/dom-helpers.js';

// Inicialización de componentes
const sidebar = new SidebarManager();
const panel = new PanelManager('editPanel', {
    titleElementId: 'editPanel h2',
    formInputIds: ['catName', 'catPoints']
});

// Cargar datos del usuario
document.addEventListener("DOMContentLoaded", () => {
    loadUserDataToUI({ nameId: 'adminName', emailId: 'adminEmail' });
});

// Variable para tracking de edición
let rowEditing = null;

// ============================================
// FUNCIONES DE PANEL
// ============================================

/**
 * Abrir panel
 */
window.openPanel = function () {
    panel.open('Nueva Categoría');
};

/**
 * Cerrar panel
 */
window.closePanel = function () {
    panel.close();
    rowEditing = null;
};

/**
 * Editar categoría
 */
window.editCategory = function (el) {
    rowEditing = el.parentElement.parentElement;
    const name = rowEditing.children[0].innerText;
    const points = rowEditing.children[1].innerText;

    panel.setData({
        catName: name,
        catPoints: points
    });

    panel.open('Editar Categoría');
};

/**
 * Guardar categoría
 */
window.saveCategory = function () {
    const data = panel.getData();
    const name = data.catName;
    const points = data.catPoints;

    if (!name || !points) {
        alert('Completa todos los campos.');
        return;
    }

    if (rowEditing) {
        // Actualizar categoría existente
        rowEditing.children[0].innerText = name;
        rowEditing.children[1].innerText = points;
        rowEditing = null;
    } else {
        // Crear nueva categoría
        const tableBody = document.querySelector("#categoryTable tbody");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td data-label="Nombre de categoría">${name}</td>
            <td data-label="Puntos asignados">${points}</td>
            <td data-label="Acciones" class="actions">
                <i class="fa-solid fa-pen" onclick="editCategory(this)"></i>
                <i class="fa-solid fa-trash" onclick="deleteCategory(this)"></i>
            </td>
        `;
        tableBody.appendChild(row);
    }

    panel.close();
};

/**
 * Eliminar categoría
 */
window.deleteCategory = function (el) {
    if (confirm('¿Eliminar esta categoría?')) {
        el.parentElement.parentElement.remove();
    }
};

// ============================================
// BUSCADOR
// ============================================

setupSearchFilter('searchInput', '#categoryTable tbody tr');

// ============================================
// BACKUP
// ============================================

/**
 * Generar backup
 */
window.generateBackup = function () {
    alert('Copia de seguridad generada (simulado).');
};

/**
 * Restaurar backup
 */
window.restoreBackup = function () {
    const file = document.getElementById("backupFile").files[0];
    if (!file) {
        alert('Selecciona un archivo para restaurar.');
        return;
    }
    alert('Restauración completada (simulado).');
};
