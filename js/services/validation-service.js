/**
 * Validation Service - Validaciones de formulario
 */

export class ValidationService {
    /**
     * Validar que las contraseñas coincidan
     */
    static validatePasswordsMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    /**
     * Calcular fortaleza de contraseña
     * @returns {Object} { class: 'weak'|'medium'|'strong', text: string }
     */
    static calculatePasswordStrength(password) {
        let score = 0;

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) {
            return { class: 'weak', text: 'Contraseña débil' };
        } else if (score <= 4) {
            return { class: 'medium', text: 'Contraseña media' };
        } else {
            return { class: 'strong', text: 'Contraseña fuerte' };
        }
    }

    /**
     * Validar campos de menor de edad
     */
    static validateMinorFields(guardianId, guardianEmail) {
        if (!guardianId || !guardianId.trim()) {
            return { valid: false, error: 'Debes ingresar la cédula del tutor legal.' };
        }
        if (!guardianEmail || !guardianEmail.trim()) {
            return { valid: false, error: 'Debes ingresar el email del tutor legal.' };
        }
        return { valid: true };
    }

    /**
     * Sanitizar nombre de usuario (solo caracteres permitidos)
     */
    static sanitizeUsername(username) {
        return username.replace(/[^a-zA-Z0-9_.-]/g, '');
    }

    /**
     * Sanitizar número de documento (solo números)
     */
    static sanitizeDocumentNumber(documentNumber) {
        return documentNumber.replace(/[^0-9]/g, '');
    }

    /**
     * Calcular edad desde fecha de nacimiento
     */
    static calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        const isMinor = age < 18 || (age === 18 && monthDiff < 0) ||
            (age === 18 && monthDiff === 0 && today.getDate() < birth.getDate());

        return { age, isMinor };
    }

    /**
     * Obtener fecha máxima permitida (hoy)
     */
    static getMaxBirthDate() {
        return new Date().toISOString().split('T')[0];
    }
}
