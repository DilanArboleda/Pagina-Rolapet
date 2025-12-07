/**
 * DOM Helpers - Funciones reutilizables para manipulación del DOM
 */

/**
 * Toggle de clase CSS en un elemento
 * @param {string} elementId - ID del elemento
 * @param {string} className - Nombre de la clase a togglear
 */
export function toggleElement(elementId, className = 'open') {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle(className);
    }
}

/**
 * Establecer texto de un elemento de forma segura
 * @param {string} elementId - ID del elemento
 * @param {string} text - Texto a establecer
 */
export function setElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Limpiar todos los inputs de un formulario
 * @param {string} formId - ID del formulario
 */
export function clearFormInputs(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/**
 * Mostrar un elemento
 * @param {string} elementId - ID del elemento
 */
export function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

/**
 * Ocultar un elemento
 * @param {string} elementId - ID del elemento
 */
export function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Obtener valor de un input de forma segura
 * @param {string} elementId - ID del input
 * @returns {string} Valor del input o string vacío
 */
export function getInputValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value.trim() : '';
}

/**
 * Establecer valor de un input
 * @param {string} elementId - ID del input
 * @param {string} value - Valor a establecer
 */
export function setInputValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = value;
    }
}
