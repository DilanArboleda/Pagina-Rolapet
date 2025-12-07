// Imports
import { SidebarManager } from '../../../../js/components/SidebarManager.js';
import { MapManager } from '../../../../js/components/MapManager.js';
import { PanelManager } from '../../../../js/components/PanelManager.js';
import { poiService } from '../../../../js/services/poi-service.js';
import { createCustomIcon } from '../../../../js/services/map-service.js';
import { loadUserDataToUI, setupDropzone, confirmAction } from '../../../../js/utils/ui-helpers.js';
import { getInputValue } from '../../../../js/utils/dom-helpers.js';

// Inicialización de componentes
const sidebar = new SidebarManager();
const mapManager = new MapManager('map', { enableLocation: true });
const panel = new PanelManager('rightPanel', {
    titleElementId: 'rightPanelTitle',
    formInputIds: ['nombreInput', 'descripcionInput', 'categoriaSelect', 'estadoSelect', 'direccionInput']
});

// Cargar datos del usuario (admin) en UI
document.addEventListener("DOMContentLoaded", () => {
    loadUserDataToUI({ nameId: 'adminName', emailId: 'adminEmail' });
    loadPOIs();
});

// Variable para tracking de edición
let filaEditando = null;

// Configurar icono personalizado para POIs
const puntoIcon = createCustomIcon('fa-solid fa-location-dot', [30, 30]);

// ============================================
// FUNCIONES DE CARGA DE DATOS
// ============================================

/**
 * Cargar POIs desde el servicio
 */
async function loadPOIs() {
    try {
        const pois = await poiService.getAllPOIs();

        // Limpiar marcadores existentes
        mapManager.clearMarkers();

        // Agregar marcadores al mapa
        pois.forEach(poi => {
            if (poi.lat && poi.lng) {
                mapManager.addMarker(poi.lat, poi.lng, {
                    id: poi.id,
                    icon: puntoIcon,
                    popup: `<b>${poi.nombre}</b>`,
                    data: poi
                });
            }
        });

        // Actualizar tabla
        renderPOIsTable(pois);
    } catch (error) {
        console.error('Error al cargar POIs:', error);
    }
}

/**
 * Renderizar tabla de POIs
 */
function renderPOIsTable(pois) {
    const tbody = document.querySelector('#puntosTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    pois.forEach(poi => {
        const row = document.createElement('tr');
        row.setAttribute('data-nombre', poi.nombre);
        row.setAttribute('data-descripcion', poi.descripcion || '');
        row.setAttribute('data-categoria', poi.categoria);
        row.setAttribute('data-estado', poi.estado);
        row.setAttribute('data-direccion', poi.direccion || '');
        row.setAttribute('data-id', poi.id);
        row.setAttribute('data-lat', poi.lat || '');
        row.setAttribute('data-lng', poi.lng || '');

        row.innerHTML = `
            <td data-label="Nombre">${poi.nombre}</td>
            <td data-label="Categoría">${poi.categoria}</td>
            <td data-label="Estado">${poi.estado}</td>
            <td data-label="Acciones" class="actions">
                <button class="edit-btn" type="button" onclick="editarPunto(this)">Editar</button>
                <button class="delete-btn" type="button" onclick="eliminarPunto(this)">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ============================================
// FUNCIONES DE PANEL
// ============================================

/**
 * Abrir panel para crear nuevo punto
 */
window.crearNuevoPunto = function () {
    filaEditando = null;
    panel.reset();
    panel.open('Crear Nuevo Punto');
};

/**
 * Editar punto existente
 */
window.editarPunto = function (btn) {
    const row = btn.closest('tr');
    filaEditando = row;

    const nombre = row.getAttribute('data-nombre');
    const descripcion = row.getAttribute('data-descripcion');
    const categoria = row.getAttribute('data-categoria');
    const estado = row.getAttribute('data-estado');
    const direccion = row.getAttribute('data-direccion');

    panel.setData({
        nombreInput: nombre,
        descripcionInput: descripcion,
        categoriaSelect: categoria,
        estadoSelect: estado,
        direccionInput: direccion
    });

    panel.open('Editar Punto de Interés');
};

/**
 * Eliminar punto
 */
window.eliminarPunto = async function (btn) {
    const confirmed = await confirmAction('¿Estás seguro de eliminar este punto?');
    if (!confirmed) return;

    const row = btn.closest('tr');
    const poiId = row.getAttribute('data-id');

    try {
        const success = await poiService.deletePOI(poiId);
        if (success) {
            row.remove();
            mapManager.removeMarker(poiId);
            alert('Punto eliminado correctamente');
        }
    } catch (error) {
        console.error('Error al eliminar POI:', error);
        alert('Error al eliminar el punto');
    }
};

/**
 * Cerrar panel
 */
window.cerrarPanel = function () {
    panel.close();
    filaEditando = null;
};

// ============================================
// GUARDAR CAMBIOS
// ============================================

document.getElementById('guardarBtn')?.addEventListener('click', async () => {
    const data = panel.getData();

    const nombre = data.nombreInput;
    const descripcion = data.descripcionInput;
    const categoria = data.categoriaSelect;
    const estado = data.estadoSelect;
    const direccion = data.direccionInput;

    if (!nombre || !categoria || !estado) {
        alert('Completa al menos nombre, categoría y estado.');
        return;
    }

    const poiData = {
        nombre,
        descripcion,
        categoria,
        estado,
        direccion,
        lat: 4.64179, // TODO: Obtener de geocodificación
        lng: -74.11686
    };

    try {
        if (filaEditando) {
            // Actualizar POI existente
            const poiId = filaEditando.getAttribute('data-id');
            await poiService.updatePOI(poiId, poiData);

            // Actualizar fila
            filaEditando.setAttribute('data-nombre', nombre);
            filaEditando.setAttribute('data-descripcion', descripcion);
            filaEditando.setAttribute('data-categoria', categoria);
            filaEditando.setAttribute('data-estado', estado);
            filaEditando.setAttribute('data-direccion', direccion);

            filaEditando.children[0].textContent = nombre;
            filaEditando.children[1].textContent = categoria;
            filaEditando.children[2].textContent = estado;

            alert('Punto actualizado correctamente');
        } else {
            // Crear nuevo POI
            const newPOI = await poiService.createPOI(poiData);

            // Agregar a tabla
            const tbody = document.querySelector('#puntosTable tbody');
            const newRow = document.createElement('tr');
            newRow.setAttribute('data-nombre', nombre);
            newRow.setAttribute('data-descripcion', descripcion);
            newRow.setAttribute('data-categoria', categoria);
            newRow.setAttribute('data-estado', estado);
            newRow.setAttribute('data-direccion', direccion);
            newRow.setAttribute('data-id', newPOI.id || Date.now());
            newRow.setAttribute('data-lat', poiData.lat);
            newRow.setAttribute('data-lng', poiData.lng);

            newRow.innerHTML = `
                <td data-label="Nombre">${nombre}</td>
                <td data-label="Categoría">${categoria}</td>
                <td data-label="Estado">${estado}</td>
                <td data-label="Acciones" class="actions">
                    <button class="edit-btn" type="button" onclick="editarPunto(this)">Editar</button>
                    <button class="delete-btn" type="button" onclick="eliminarPunto(this)">Eliminar</button>
                </td>
            `;
            tbody.appendChild(newRow);

            // Agregar marcador al mapa
            mapManager.addMarker(poiData.lat, poiData.lng, {
                id: newPOI.id || Date.now(),
                icon: puntoIcon,
                popup: `<b>${nombre}</b>`,
                data: poiData
            });

            alert('Punto creado correctamente');
        }

        panel.close();
        filaEditando = null;
    } catch (error) {
        console.error('Error al guardar POI:', error);
        alert('Error al guardar el punto');
    }
});

// ============================================
// DROPZONE
// ============================================

setupDropzone('dropzone', async (files) => {
    console.log('Archivos seleccionados:', files);

    // TODO: Implementar subida de imágenes cuando haya un POI seleccionado
    if (filaEditando) {
        const poiId = filaEditando.getAttribute('data-id');
        try {
            await poiService.uploadPOIImages(poiId, files);
            alert('Imágenes subidas correctamente (simulado)');
        } catch (error) {
            console.error('Error al subir imágenes:', error);
        }
    } else {
        alert('Archivos listos para enviar al backend (simulado).');
    }
});

// ============================================
// FILTROS
// ============================================

function aplicarFiltros() {
    const texto = getInputValue('searchInput').toLowerCase();
    const cat = getInputValue('filtroCategoria');
    const est = getInputValue('filtroEstado');

    document.querySelectorAll('#puntosTable tbody tr').forEach(row => {
        const nombre = (row.getAttribute('data-nombre') || '').toLowerCase();
        const categoria = row.getAttribute('data-categoria') || '';
        const estado = row.getAttribute('data-estado') || '';

        const coincideTexto = !texto || nombre.includes(texto);
        const coincideCat = !cat || categoria === cat;
        const coincideEst = !est || estado === est;

        row.style.display = (coincideTexto && coincideCat && coincideEst) ? "" : "none";
    });
}

document.getElementById('searchInput')?.addEventListener('input', aplicarFiltros);
document.getElementById('filtroCategoria')?.addEventListener('change', aplicarFiltros);
document.getElementById('filtroEstado')?.addEventListener('change', aplicarFiltros);
