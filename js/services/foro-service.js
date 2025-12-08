import { api } from '../utils/api-client.js';
import API from '../utils/endpoints.js';

/**
 * Servicio simple para gestionar los foros
 */
class ForoService {
    /**
     * Obtiene todos los foros disponibles
     * @returns {Promise<Array>} Array de foros
     */
    async getAllForos() {
        try {
            const response = await api.get(API.FORO.GET_PUBLICACIONES_BY_FORO);

            if (response.status === 'success' && response.data) {
                return response.data; // Retornar directamente los datos
            }

            return [];
        } catch (error) {
            console.error('Error al obtener foros:', error);
            return [];
        }
    }

    /**
     * Obtiene un foro específico por ID
     * @param {number} foroId - ID del foro
     * @returns {Promise<Object|null>} Datos del foro
     */
    async getForoById(foroId) {
        try {
            const response = await api.get(API.CONTENIDO.GET_PUBLICACIONES_BY_FORO(foroId));
            if (response.status === 'success' && response.data) {
                return response.data;
            }

            return null;
        } catch (error) {
            console.error(`Error al obtener foro ${foroId}:`, error);
            return null;
        }
    }
}

// Exportar instancia única del servicio
export const foroService = new ForoService();
