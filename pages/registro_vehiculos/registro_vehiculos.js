import { api } from "../../js/utils/api-client.js";
import API from "../../js/utils/endpoints.js";
import { userService } from "../../js/services/user-service.js";

// Registro de Vehículos - lógica básica de envío

document.addEventListener('DOMContentLoaded', () => {
    const matriculaInput = document.getElementById('matriculaInput');
    const submitBtn = document.getElementById('btnRegistrarVehiculo');

    if (!matriculaInput || !submitBtn) {
        return;
    }

    submitBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const matricula = matriculaInput.value.trim();
        if (!matricula) {
            alert('Por favor ingresa la matrícula del vehículo.');
            return;
        }

        try {
            const currentUser = userService.getFromCache();
            const userId = currentUser?.user_id;

            if (!userId) {
                throw new Error('No se encontró el usuario en sesión');
            }

            const payload = {
                matricula,
                idUsuario: userId
            };

            const response = await api.post(API.VEHICULO.POST_CREAR_VEHICULO, payload);
            console.log('Respuesta registro vehículo:', response);

            alert('Vehículo registrado correctamente.');
            // Opcional: limpiar solo la matrícula
            // matriculaInput.value = '';
        } catch (error) {
            console.error('Error registrando vehículo:', error);
            alert('No se pudo registrar el vehículo. Intenta nuevamente.');
        }
    });
});
