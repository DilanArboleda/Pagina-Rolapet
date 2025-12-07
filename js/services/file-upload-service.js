/**
 * File Upload Service - Manejo de archivos
 */

export class FileUploadService {
    constructor() {
        this.maxSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    }

    /**
     * Validar archivo
     */
    validateFile(file) {
        if (!this.allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'Formato de archivo no válido. Solo se permiten PDF, JPG y PNG.'
            };
        }

        if (file.size > this.maxSize) {
            return {
                valid: false,
                error: 'El archivo es demasiado grande. El tamaño máximo es 5MB.'
            };
        }

        return { valid: true };
    }

    /**
     * Formatear tamaño de archivo
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Configurar dropzone para un elemento
     */
    setupDropzone(wrapperId, inputId, onFileSelect) {
        const wrapper = document.getElementById(wrapperId);
        const input = document.getElementById(inputId);

        if (!wrapper || !input) return;

        // Drag over
        wrapper.addEventListener('dragover', (e) => {
            e.preventDefault();
            wrapper.classList.add('dragover');
        });

        // Drag leave
        wrapper.addEventListener('dragleave', () => {
            wrapper.classList.remove('dragover');
        });

        // Drop
        wrapper.addEventListener('drop', (e) => {
            e.preventDefault();
            wrapper.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && onFileSelect) {
                onFileSelect(files[0]);
            }
        });

        // Input change
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0 && onFileSelect) {
                onFileSelect(e.target.files[0]);
            }
        });
    }

    /**
     * Mostrar preview de archivo
     */
    showPreview(previewId, fileNameId, fileSizeId, file) {
        const preview = document.getElementById(previewId);
        const nameElement = document.getElementById(fileNameId);
        const sizeElement = document.getElementById(fileSizeId);

        if (preview && nameElement && sizeElement) {
            nameElement.textContent = file.name;
            sizeElement.textContent = this.formatFileSize(file.size);
            preview.classList.add('show');
        }
    }

    /**
     * Ocultar preview de archivo
     */
    hidePreview(previewId) {
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.classList.remove('show');
        }
    }

    /**
     * Configurar botón de remover archivo
     */
    setupRemoveButton(buttonId, inputId, previewId, onRemove) {
        const button = document.getElementById(buttonId);
        const input = document.getElementById(inputId);

        if (!button || !input) return;

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            input.value = '';
            this.hidePreview(previewId);
            if (onRemove) onRemove();
        });
    }
}
