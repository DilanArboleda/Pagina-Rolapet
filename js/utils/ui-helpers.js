/**
 * UI Helpers - Funciones de UI comunes en el apartado de gestion_usuario_admin
 */

import { userService } from '../services/user-service.js';

/**
 * Configurar filtro de búsqueda genérico
 * @param {string} inputId - ID del input de búsqueda
 * @param {string} targetSelector - Selector CSS de los elementos a filtrar
 * @param {Function} filterFn - Función de filtrado personalizada (opcional)
 */
export function setupSearchFilter(inputId, targetSelector, filterFn = null) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', () => {
        const searchValue = input.value.toLowerCase();
        const elements = document.querySelectorAll(targetSelector);

        elements.forEach(element => {
            if (filterFn) {
                element.style.display = filterFn(element, searchValue) ? '' : 'none';
            } else {
                // Filtro por defecto: buscar en el texto del elemento
                const text = element.textContent.toLowerCase();
                element.style.display = text.includes(searchValue) ? '' : 'none';
            }
        });
    });
}

/**
 * Configurar zona de arrastre de archivos (dropzone)
 * @param {string} elementId - ID del elemento dropzone
 * @param {Function} onFilesDrop - Callback cuando se sueltan archivos
 */
export function setupDropzone(elementId, onFilesDrop) {
    const dropzone = document.getElementById(elementId);
    if (!dropzone) return;

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.background = '#e8f4ff';
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.style.background = '#fafbfc';
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.background = '#fafbfc';

        if (onFilesDrop && e.dataTransfer.files.length > 0) {
            onFilesDrop(e.dataTransfer.files);
        }
    });

    dropzone.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (e) => {
            if (onFilesDrop && e.target.files.length > 0) {
                onFilesDrop(e.target.files);
            }
        };
        input.click();
    });
}

/**
 * Confirmación de acción con Promise
 * @param {string} message - Mensaje de confirmación
 * @returns {Promise<boolean>} True si el usuario confirma
 */
export function confirmAction(message) {
    return Promise.resolve(confirm(message));
}

/**
 * Cargar datos del usuario en elementos del DOM
 * @param {Object} options - Opciones de configuración
 * @param {string} options.nameId - ID del elemento donde mostrar el nombre
 * @param {string} options.emailId - ID del elemento donde mostrar el email
 */
export function loadUserDataToUI({ nameId, emailId }) {
    try {
        const user = userService.getFromCache();

        if (nameId) {
            const nameElement = document.getElementById(nameId);
            if (nameElement) {
                // Construir nombre completo
                const fullName = [user.nombre, user.apellido1, user.apellido2]
                    .filter(Boolean)
                    .join(' ') || 'Usuario';
                nameElement.textContent = fullName;
            }
        }

        if (emailId) {
            const emailElement = document.getElementById(emailId);
            if (emailElement) {
                emailElement.textContent = user.email || 'email@example.com';
            }
        }
    } catch (error) {
        console.warn('No se pudo cargar datos del usuario:', error);
        // Fallback a localStorage legacy si existe
        if (nameId) {
            const nameElement = document.getElementById(nameId);
            if (nameElement) {
                nameElement.textContent = localStorage.getItem('adminName') || 'Administrador';
            }
        }
        if (emailId) {
            const emailElement = document.getElementById(emailId);
            if (emailElement) {
                emailElement.textContent = localStorage.getItem('adminEmail') || 'admin@example.com';
            }
        }
    }
}
