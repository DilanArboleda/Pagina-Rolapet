import { api } from '../utils/api-client.js';
import API from '../utils/endpoints.js';

/**
 * Servicio para gestionar las publicaciones del blog
 */
class PublicacionService {
    constructor() {
        // Mapeo de IDs de foro a nombres
        this.foroMap = {
            1: 'TIENDA',
            2: 'TALLER',
            3: 'FORO'
        };

        // Mapeo inverso para filtrar por nombre
        this.foroIdMap = {
            'TIENDA': 1,
            'TALLER': 2,
            'FORO': 3
        };
    }

    /**
     * Obtiene todas las publicaciones
     * @returns {Promise<Array>} Array de publicaciones
     */
    async getAllPublicaciones() {
        try {
            const response = await api.get(API.CONTENIDO.GET_PUBLICACIONES);

            if (response.status === 'success' && response.data) {
                return this.mapPublicaciones(response.data);
            }

            return [];
        } catch (error) {
            console.error('Error al obtener publicaciones:', error);
            throw error;
        }
    }

    /**
     * Obtiene publicaciones filtradas por foro
     * @param {string} foroNombre - Nombre del foro (TIENDA, TALLER, FORO)
     * @returns {Promise<Array>} Array de publicaciones filtradas
     */
    async getPublicacionesByForo(foroNombre) {
        try {
            const foroId = this.foroIdMap[foroNombre];

            if (!foroId) {
                throw new Error(`Foro inválido: ${foroNombre}`);
            }

            const response = await api.get(
                `${API.CONTENIDO.GET_PUBLICACIONES_BY_FORO}${foroId}`
            );

            if (response.status === 'success' && response.data) {
                return this.mapPublicaciones(response.data);
            }

            return [];
        } catch (error) {
            console.error(`Error al obtener publicaciones del foro ${foroNombre}:`, error);
            throw error;
        }
    }

    /**
     * Obtiene publicaciones de un usuario específico
     * @param {number} usuarioId - ID del usuario
     * @returns {Promise<Array>} Array de publicaciones del usuario
     */
    async getPublicacionesByUsuario(usuarioId) {
        try {
            const response = await api.get(
                API.CONTENIDO.GET_PUBLICACIONES_BY_USUARIO(usuarioId)
            );

            if (response.status === 'success' && response.data) {
                return this.mapPublicaciones(response.data);
            }

            return [];
        } catch (error) {
            console.error(`Error al obtener publicaciones del usuario ${usuarioId}:`, error);
            throw error;
        }
    }

    /**
     * Mapea las publicaciones del backend al formato usado en el frontend
     * @param {Array} publicaciones - Array de publicaciones del backend
     * @returns {Array} Array de publicaciones mapeadas
     */
    mapPublicaciones(publicaciones) {
        return publicaciones.map(pub => ({
            id: pub.id,
            titulo: pub.titulo,
            contenido: pub.textoContenido,
            usuarioId: pub.usuario,
            // Por ahora usamos el ID del usuario como nombre, 
            // más adelante se puede obtener el nombre real
            usuarioNombre: `Usuario ${pub.usuario}`,
            foro: this.foroMap[pub.idForo] || 'FORO',
            foroId: pub.idForo,
            fecha: pub.fechaContenido,
            // Calcular tiempo relativo
            tiempoRelativo: this.calcularTiempoRelativo(pub.fechaContenido),
            // Likes y comentarios se implementarán después
            likes: pub.likes || 0,
            comentarios: [],
            // Multimedia se implementará después
            multimediaId: pub.idMultimedia,
            imagenUrl: null // Por ahora null, se obtendrá después
        }));
    }

    /**
     * Calcula el tiempo relativo desde la fecha de publicación
     * @param {string} fechaContenido - Fecha en formato ISO
     * @returns {string} Tiempo relativo (ej: "Hace 2 horas")
     */
    calcularTiempoRelativo(fechaContenido) {
        const ahora = new Date();
        const fecha = new Date(fechaContenido);
        const diffMs = ahora - fecha;
        const diffMinutos = Math.floor(diffMs / 60000);
        const diffHoras = Math.floor(diffMs / 3600000);
        const diffDias = Math.floor(diffMs / 86400000);

        if (diffMinutos < 1) {
            return 'Ahora mismo';
        } else if (diffMinutos < 60) {
            return `Hace ${diffMinutos} min`;
        } else if (diffHoras < 24) {
            return `Hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
        } else if (diffDias < 7) {
            return `Hace ${diffDias} ${diffDias === 1 ? 'día' : 'días'}`;
        } else {
            // Formato de fecha para más de una semana
            return fecha.toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'short',
                year: fecha.getFullYear() !== ahora.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    /**
     * Filtra publicaciones por término de búsqueda
     * @param {Array} publicaciones - Array de publicaciones
     * @param {string} searchTerm - Término de búsqueda
     * @returns {Array} Publicaciones filtradas
     */
    filterBySearch(publicaciones, searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return publicaciones;
        }

        const term = searchTerm.toLowerCase().trim();

        return publicaciones.filter(pub =>
            pub.titulo.toLowerCase().includes(term) ||
            pub.contenido.toLowerCase().includes(term) ||
            pub.usuarioNombre.toLowerCase().includes(term)
        );
    }

    /**
     * Obtiene el color del badge según el tipo de foro
     * @param {string} foro - Tipo de foro (TIENDA, TALLER, FORO)
     * @returns {Object} Objeto con colores de fondo y texto
     */
    getBadgeColors(foro) {
        const colors = {
            'TIENDA': {
                bg: '#C8E6C9',
                text: '#2E7D32'
            },
            'TALLER': {
                bg: '#FFE0B2',
                text: '#F57C00'
            },
            'FORO': {
                bg: '#BBDEFB',
                text: '#1976D2'
            }
        };

        return colors[foro] || colors['FORO'];
    }

    /**
     * Obtiene el icono según el tipo de foro
     * @param {string} foro - Tipo de foro
     * @returns {string} Nombre del icono de Material Symbols
     */
    getForoIcon(foro) {
        const icons = {
            'TIENDA': 'storefront',
            'TALLER': 'build',
            'FORO': 'forum'
        };

        return icons[foro] || 'article';
    }
}

// Exportar instancia única del servicio
export const publicacionService = new PublicacionService();
