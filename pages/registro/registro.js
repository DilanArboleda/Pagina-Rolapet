import { ValidationService } from '../../js/services/validation-service.js';
import { FormService } from '../../js/services/form-service.js';
import { FileUploadService } from '../../js/services/file-upload-service.js';
import { RegistrationService } from '../../js/services/registration-service.js';

// ============================================
// INICIALIZACIÓN DE SERVICIOS
// ============================================
const formService = new FormService('signupForm', 'errorMessage', 'successMessage', 'errorText', 'successText');
const fileService = new FileUploadService();

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================
let currentUserType = 'user';
let isMinor = false;
let uploadedFile = null;
let uploadedAuthFile = null;

// ============================================
// ELEMENTOS DEL DOM
// ============================================
const userTypeBtns = document.querySelectorAll('.user-type-btn');
const signupForm = document.getElementById('signupForm');
const birthdateInput = document.getElementById('birthdate');
const birthdateField = document.querySelector('.birthdate-field');
const ageWarning = document.getElementById('ageWarning');
const guardianSection = document.getElementById('guardianSection');
const guardianIdInput = document.getElementById('guardianId');
const guardianEmailInput = document.getElementById('guardianEmail');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const passwordStrength = document.getElementById('passwordStrength');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// ============================================
// CAMBIAR TIPO DE USUARIO
// ============================================
userTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        userTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentUserType = btn.dataset.type;
        formService.hideMessages();
        updateFormFields();
    });
});

// Actualizar campos según tipo de usuario
function updateFormFields() {
    if (currentUserType === 'provider') {
        birthdateField.style.display = 'none';
        birthdateInput.required = false;
        birthdateInput.value = '';
        ageWarning.classList.remove('show');
        guardianSection.classList.remove('show');
        isMinor = false;
    } else {
        birthdateField.style.display = 'block';
        birthdateInput.required = true;
    }
}

// Inicializar campos al cargar
updateFormFields();

// ============================================
// VALIDACIÓN DE EDAD
// ============================================
birthdateInput.addEventListener('change', (e) => {
    const ageData = ValidationService.calculateAge(e.target.value);
    isMinor = ageData.isMinor;

    if (isMinor) {
        ageWarning.classList.add('show');
        guardianSection.classList.add('show');
        guardianIdInput.required = true;
        guardianEmailInput.required = true;
    } else {
        ageWarning.classList.remove('show');
        guardianSection.classList.remove('show');
        guardianIdInput.required = false;
        guardianEmailInput.required = false;
        guardianIdInput.value = '';
        guardianEmailInput.value = '';
        uploadedFile = null;
        uploadedAuthFile = null;
        fileService.hidePreview('filePreview');
        fileService.hidePreview('authFilePreview');
    }
});

// ============================================
// MANEJO DE ARCHIVOS
// ============================================
fileService.setupDropzone('fileUploadWrapper', 'guardianDocument', (file) => {
    const validation = fileService.validateFile(file);
    if (!validation.valid) {
        formService.showError(validation.error);
        return;
    }
    uploadedFile = file;
    fileService.showPreview('filePreview', 'fileName', 'fileSize', file);
});

fileService.setupDropzone('authFileUploadWrapper', 'authorizationDocument', (file) => {
    const validation = fileService.validateFile(file);
    if (!validation.valid) {
        formService.showError(validation.error);
        return;
    }
    uploadedAuthFile = file;
    fileService.showPreview('authFilePreview', 'authFileName', 'authFileSize', file);
});

fileService.setupRemoveButton('removeFile', 'guardianDocument', 'filePreview', () => {
    uploadedFile = null;
});

fileService.setupRemoveButton('removeAuthFile', 'authorizationDocument', 'authFilePreview', () => {
    uploadedAuthFile = null;
});

// ============================================
// TOGGLE CONTRASEÑAS
// ============================================
togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.textContent = type === 'password' ? 'visibility_off' : 'visibility';
});

toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    confirmPasswordInput.type = type;
    toggleConfirmPassword.textContent = type === 'password' ? 'visibility_off' : 'visibility';
});

// ============================================
// VALIDACIÓN DE FORTALEZA DE CONTRASEÑA
// ============================================
passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    const strength = ValidationService.calculatePasswordStrength(password);

    if (password.length > 0) {
        passwordStrength.classList.add('show');
        strengthFill.className = 'strength-fill ' + strength.class;
        strengthText.className = 'strength-text ' + strength.class;
        strengthText.textContent = strength.text;
    } else {
        passwordStrength.classList.remove('show');
    }
});

// ============================================
// ENVÍO DEL FORMULARIO
// ============================================
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formService.hideMessages();

    // Validar contraseñas coincidan
    if (!ValidationService.validatePasswordsMatch(passwordInput.value, confirmPasswordInput.value)) {
        formService.showError('Las contraseñas no coinciden. Por favor, verifica.');
        return;
    }

    // Validar fortaleza mínima de contraseña
    const strength = ValidationService.calculatePasswordStrength(passwordInput.value);
    if (strength.class === 'weak') {
        formService.showError('La contraseña es demasiado débil. Usa al menos 8 caracteres, mayúsculas, minúsculas y números.');
        return;
    }

    // Validar campos de menor de edad
    if (isMinor) {
        const minorValidation = ValidationService.validateMinorFields(
            guardianIdInput.value,
            guardianEmailInput.value
        );
        if (!minorValidation.valid) {
            formService.showError(minorValidation.error);
            return;
        }
    }

    // Deshabilitar botón durante el envío
    const originalText = formService.disableSubmit('submitBtn', 'Registrando...');

    try {
        // Preparar datos del formulario
        const formData = {
            firstName: formService.getFieldValue('firstName'),
            lastName: formService.getFieldValue('lastName'),
            lastName2: '',
            documentNumber: formService.getFieldValue('documentNumber'),
            email: formService.getFieldValue('email'),
            birthdate: birthdateInput.value,
            password: passwordInput.value,
            guardianEmail: guardianEmailInput.value
        };

        // Preparar datos de registro
        const requestBody = RegistrationService.prepareRegistrationData(formData, currentUserType, isMinor);

        // Realizar registro
        const result = await RegistrationService.register(requestBody);

        if (!result.success) {
            formService.showError(result.error);
            return;
        }

        // Manejar respuesta exitosa
        const responseHandler = RegistrationService.handleRegistrationResponse(result.data);
        formService.showSuccess(responseHandler.message);

        // Limpiar formulario
        formService.reset();
        uploadedFile = null;
        uploadedAuthFile = null;
        fileService.hidePreview('filePreview');
        fileService.hidePreview('authFilePreview');
        passwordStrength.classList.remove('show');
        ageWarning.classList.remove('show');
        guardianSection.classList.remove('show');

        // Redirigir
        RegistrationService.redirect(responseHandler.redirectUrl, responseHandler.redirectDelay);

    } catch (error) {
        console.error('Error inesperado:', error);
        formService.showError('Error inesperado. Por favor, intenta de nuevo.');
    } finally {
        formService.enableSubmit('submitBtn', originalText);
    }
});

// ============================================
// CONFIGURACIÓN INICIAL
// ============================================
// Limpiar mensajes al escribir
formService.setupInputListeners();

// Validaciones en tiempo real
document.getElementById('username').addEventListener('input', (e) => {
    e.target.value = ValidationService.sanitizeUsername(e.target.value);
});

document.getElementById('documentNumber').addEventListener('input', (e) => {
    e.target.value = ValidationService.sanitizeDocumentNumber(e.target.value);
});

// Validar que no se pueda seleccionar fecha futura
birthdateInput.setAttribute('max', ValidationService.getMaxBirthDate());
