/**
 * Registration Service - Lógica de registro de usuarios
 */

import { api } from '../utils/api-client.js';
import API from '../utils/endpoints.js';

export class RegistrationService {
    /**
     * Preparar datos de registro para el backend
     */
    static prepareRegistrationData(formData, userType, isMinor) {
        const requestBody = {
            name: formData.firstName,
            apellido1: formData.lastName,
            apellido2: formData.lastName2 || "",
            fechaNacimiento: formData.birthdate || null,
            documento: {
                idTipoDocumento: 1,
                numeroDocumento: formData.documentNumber,
                fechaExpiracion: "2030-12-31T00:00:00"
            },
            email: formData.email,
            strikes: 0,
            idRol: userType === 'provider' ? 2 : 1, // 2 = Proveedor, 1 = Usuario
            password: formData.password
        };

        // Solo agregar emailTutor si es menor de edad
        if (isMinor && userType !== 'provider') {
            requestBody.emailTutor = formData.guardianEmail;
        }

        return requestBody;
    }

    /**
     * Registrar usuario
     */
    static async register(requestBody) {
        try {
            const response = await api.post(API.AUTH.SIGNIN, requestBody);
            return { success: true, data: response };
        } catch (error) {
            console.error('Error al registrar:', error);

            let errorMsg = 'Error al crear la cuenta. Por favor, intenta de nuevo.';

            // Intentar parsear el mensaje de error
            if (error.message) {
                try {
                    const errorData = JSON.parse(error.message);
                    errorMsg = errorData.message || errorMsg;
                } catch {
                    errorMsg = error.message;
                }
            }

            return { success: false, error: errorMsg };
        }
    }

    /**
     * Manejar respuesta de registro
     * @returns {Object} { type: 'approval'|'success'|'error', message: string, redirectUrl: string }
     */
    static handleRegistrationResponse(response) {
        // Código 409 - Email enviado para aprobación
        if (response.code === 409 && response.status === 'informacion') {
            return {
                type: 'approval',
                message: '¡Correo enviado para aprobación! Por favor, revisa tu bandeja de entrada para confirmar tu cuenta.',
                redirectUrl: '/',
                redirectDelay: 3000
            };
        }

        // Registro exitoso
        return {
            type: 'success',
            message: '¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...',
            redirectUrl: '/pages/login/login.html',
            redirectDelay: 2000
        };
    }

    /**
     * Redirigir después de un delay
     */
    static redirect(url, delay = 2000) {
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    }
}
