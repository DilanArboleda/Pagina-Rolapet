/**
 * PanelManager - Clase para gestionar paneles laterales de edición
 */

import { hideElement, showElement, getInputValue, setInputValue } from '../utils/dom-helpers.js';

export class PanelManager {
    /**
     * @param {string} panelId - ID del panel
     * @param {Object} options - Opciones de configuración
     * @param {string} options.titleElementId - ID del elemento del título
     * @param {Array<string>} options.formInputIds - IDs de los inputs del formulario
     */
    constructor(panelId, options = {}) {
        this.panelId = panelId;
        this.panel = null;
        this.titleElement = null;
        this.currentData = null;
        this.options = {
            titleElementId: options.titleElementId || null,
            formInputIds: options.formInputIds || [],
            ...options
        };
        this.init();
    }

    /**
     * Inicializar el panel
     */
    init() {
        this.panel = document.getElementById(this.panelId);
        if (!this.panel) {
            console.warn(`Panel con ID '${this.panelId}' no encontrado`);
        }

        if (this.options.titleElementId) {
            this.titleElement = document.getElementById(this.options.titleElementId);
        }
    }

    /**
     * Abrir el panel
     * @param {string} title - Título del panel
     * @param {Object} data - Datos a cargar en el panel (opcional)
     */
    open(title = '', data = null) {
        if (!this.panel) return;

        showElement(this.panelId);

        if (this.titleElement && title) {
            this.titleElement.textContent = title;
        }

        if (data) {
            this.setData(data);
        }

        this.currentData = data;
    }

    /**
     * Cerrar el panel
     */
    close() {
        if (!this.panel) return;

        hideElement(this.panelId);
        this.reset();
        this.currentData = null;
    }

    /**
     * Obtener datos del formulario
     * @returns {Object} Datos del formulario
     */
    getData() {
        const data = {};

        this.options.formInputIds.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                if (element.type === 'checkbox') {
                    data[inputId] = element.checked;
                } else {
                    data[inputId] = element.value.trim();
                }
            }
        });

        return data;
    }

    /**
     * Establecer datos en el formulario
     * @param {Object} data - Datos a establecer
     */
    setData(data) {
        if (!data) return;

        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = data[key];
                } else {
                    element.value = data[key] || '';
                }
            }
        });
    }

    /**
     * Resetear el formulario
     */
    reset() {
        this.options.formInputIds.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = false;
                } else {
                    element.value = '';
                }
            }
        });

        if (this.titleElement) {
            this.titleElement.textContent = '';
        }
    }

    /**
     * Verificar si el panel está abierto
     * @returns {boolean}
     */
    isOpen() {
        if (!this.panel) return false;
        return this.panel.style.display === 'block';
    }

    /**
     * Obtener los datos actuales cargados en el panel
     * @returns {Object|null}
     */
    getCurrentData() {
        return this.currentData;
    }
}
