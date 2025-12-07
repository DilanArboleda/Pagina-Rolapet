/**
 * Form Service - Manejo de formularios y mensajes
 */

export class FormService {
    constructor(formId, errorMessageId, successMessageId, errorTextId, successTextId) {
        this.form = document.getElementById(formId);
        this.errorMessage = document.getElementById(errorMessageId);
        this.successMessage = document.getElementById(successMessageId);
        this.errorText = document.getElementById(errorTextId);
        this.successText = document.getElementById(successTextId);
    }

    /**
     * Mostrar mensaje de error
     */
    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.add('show');
        this.successMessage.classList.remove('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Mostrar mensaje de éxito
     */
    showSuccess(message) {
        this.successText.textContent = message;
        this.successMessage.classList.add('show');
        this.errorMessage.classList.remove('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Ocultar todos los mensajes
     */
    hideMessages() {
        this.errorMessage.classList.remove('show');
        this.successMessage.classList.remove('show');
    }

    /**
     * Resetear formulario
     */
    reset() {
        this.form.reset();
        this.hideMessages();
    }

    /**
     * Obtener valor de un campo
     */
    getFieldValue(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? field.value.trim() : '';
    }

    /**
     * Deshabilitar botón de submit
     */
    disableSubmit(buttonId, loadingText = 'Procesando...') {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            const textSpan = button.querySelector('span:first-child');
            if (textSpan) {
                const originalText = textSpan.textContent;
                textSpan.textContent = loadingText;
                return originalText;
            }
        }
        return null;
    }

    /**
     * Habilitar botón de submit
     */
    enableSubmit(buttonId, originalText) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            const textSpan = button.querySelector('span:first-child');
            if (textSpan && originalText) {
                textSpan.textContent = originalText;
            }
        }
    }

    /**
     * Configurar limpieza de mensajes al escribir
     */
    setupInputListeners() {
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.hideMessages());
        });
    }
}
