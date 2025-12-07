// Imports
import { SidebarManager } from '../../../../js/components/SidebarManager.js';
import { loadUserDataToUI, setupSearchFilter } from '../../../../js/utils/ui-helpers.js';

// Inicialización de componentes
const sidebar = new SidebarManager();

// Cargar datos del usuario
document.addEventListener("DOMContentLoaded", () => {
    loadUserDataToUI({ nameId: 'adminName', emailId: 'adminEmail' });
});

// ============================================
// FUNCIONES DE TARJETAS
// ============================================

/**
 * Eliminar tarjeta
 */
window.removeCard = function (id) {
    const el = document.getElementById(id);
    if (el) el.remove();
};

// ============================================
// PALABRAS PROHIBIDAS
// ============================================

/**
 * Agregar palabra prohibida
 */
window.addWord = function () {
    const w = document.getElementById('newWord').value.trim();
    if (!w) return;

    const div = document.createElement('div');
    div.innerHTML = `<span>${w}</span> <i onclick="deleteWord(this)" class="fa-solid fa-trash"></i>`;
    document.getElementById('wordList').appendChild(div);
    document.getElementById('newWord').value = "";
};

/**
 * Eliminar palabra prohibida
 */
window.deleteWord = function (el) {
    el.parentElement.remove();
};

// ============================================
// BUSCADOR
// ============================================

setupSearchFilter('searchInput', '.mod-row');