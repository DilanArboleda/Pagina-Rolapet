import { api } from '../utils/api-client.js';
import API from '../utils/endpoints.js';

/**
 * Servicio simple para gestionar los comentarios
 */
class ComentarioService {
    /**
     * Obtiene todos los comentarios de una publicación
     * @param {number} publicacionId - ID de la publicación
     * @returns {Promise<Array>} Array de comentarios
     */
    async getComentariosByPublicacion(publicacionId) {
        try {
            // Reemplazar el /1 hardcodeado con el ID real
            const endpoint = API.CONTENIDO.GET_COMENTARIOS_BY_PUBLICACION.replace('/1', `/${publicacionId}`);
            const response = await api.get(endpoint);

            if (response.status === 'success' && response.data) {
                return response.data; // Retornar directamente los datos
            }

            return [];
        } catch (error) {
            console.error(`Error al obtener comentarios de publicación ${publicacionId}:`, error);
            return [];
        }
    }

    /**
     * Crea un nuevo comentario
     * @param {Object} comentarioData - Datos del comentario
     * @returns {Promise<Object|null>} Comentario creado
     */
    async crearComentario(comentarioData) {
        try {
            const payload = {
                textoContenido: comentarioData.texto,
                idPublicacion: comentarioData.publicacionId,
                usuario: comentarioData.usuarioId,
                idComentarioPadre: comentarioData.comentarioPadreId || null
            };

            const response = await api.post(API.CONTENIDO.POST_CREAR_COMENTARIO, payload);

            if (response.status === 'success' && response.data) {
                return response.data;
            }

            return null;
        } catch (error) {
            console.error('Error al crear comentario:', error);
            throw error;
        }
    }

    /**
     * Calcula el tiempo relativo desde una fecha
     * @param {string} fecha - Fecha en formato ISO
     * @returns {string} Tiempo relativo
     */
    calcularTiempoRelativo(fecha) {
        if (!fecha) return 'Hace un momento';

        const ahora = new Date();
        const fechaComentario = new Date(fecha);
        const diffMs = ahora - fechaComentario;
        const diffMinutos = Math.floor(diffMs / 60000);
        const diffHoras = Math.floor(diffMs / 3600000);
        const diffDias = Math.floor(diffMs / 86400000);

        if (diffMinutos < 1) return 'Ahora mismo';
        if (diffMinutos < 60) return `Hace ${diffMinutos} min`;
        if (diffHoras < 24) return `Hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
        if (diffDias < 7) return `Hace ${diffDias} ${diffDias === 1 ? 'día' : 'días'}`;

        return fechaComentario.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short'
        });
    }

    /**
     * Obtiene iniciales del nombre de usuario
     * @param {number} usuarioId - ID del usuario
     * @returns {string} Iniciales
     */
    getIniciales(usuarioId) {
        return `U${usuarioId}`;
    }

    /**
     * Obtiene color de avatar basado en ID de usuario
     * @param {number} usuarioId - ID del usuario
     * @returns {Object} Colores de fondo y texto
     */
    getAvatarColor(usuarioId) {
        const colores = [
            { bg: '#FFEBEE', text: '#C62828' },
            { bg: '#E8EAF6', text: '#283593' },
            { bg: '#E0F2F1', text: '#00695C' },
            { bg: '#FFF3E0', text: '#E65100' },
            { bg: '#F3E5F5', text: '#6A1B9A' },
            { bg: '#E1F5FE', text: '#01579B' }
        ];

        return colores[usuarioId % colores.length];
    }
}

// Exportar instancia única del servicio
export const comentarioService = new ComentarioService();
