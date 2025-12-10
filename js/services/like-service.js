/**
 * Like Service - Servicio para gestión de likes con WebSocket
 */

import { api } from '../utils/api-client.js';
import API from '../utils/endpoints.js';
import { websocketService } from './websocket-service.js';

class LikeService {
    constructor() {
        this.likesCache = new Map(); // Cache de likes por publicación
        this.userLikes = new Set(); // Set de publicaciones que el usuario ha dado like
    }

    /**
     * Dar like a una publicación
     * @param {number} publicacionId - ID de la publicación
     * @param {number} usuarioId - ID del usuario
     * @returns {Promise<Object>}
     */
    async darLike(publicacionId, usuarioId) {
        try {
            const response = await api.post(
                API.CONTENIDO.LIKE_PUBLICACION(publicacionId, usuarioId)
            );

            if (response.status === 'success') {
                // Actualizar cache local
                this.userLikes.add(publicacionId);

                return response.data;
            }

            throw new Error(response.message || 'Error al dar like');
        } catch (error) {
            console.error('Error al dar like:', error);
            throw error;
        }
    }

    /**
     * Quitar like de una publicación
     * @param {number} publicacionId - ID de la publicación
     * @param {number} usuarioId - ID del usuario
     * @returns {Promise<Object>}
     */
    async quitarLike(publicacionId, usuarioId) {
        try {
            const response = await api.delete(
                API.CONTENIDO.UNLIKE_PUBLICACION(publicacionId, usuarioId)
            );

            if (response.status === 'success') {
                // Actualizar cache local
                this.userLikes.delete(publicacionId);

                return response.data;
            }

            throw new Error(response.message || 'Error al quitar like');
        } catch (error) {
            console.error('Error al quitar like:', error);
            throw error;
        }
    }

    /**
     * Toggle like (dar o quitar)
     * @param {number} publicacionId - ID de la publicación
     * @param {number} usuarioId - ID del usuario
     * @returns {Promise<Object>}
     */
    async toggleLike(publicacionId, usuarioId) {
        const hasLiked = this.userLikes.has(publicacionId);

        if (hasLiked) {
            return await this.quitarLike(publicacionId, usuarioId);
        } else {
            return await this.darLike(publicacionId, usuarioId);
        }
    }

    /**
     * Verificar si el usuario dio like a una publicación
     * @param {number} publicacionId - ID de la publicación
     * @returns {boolean}
     */
    hasUserLiked(publicacionId) {
        return this.userLikes.has(publicacionId);
    }

    /**
     * Suscribirse a actualizaciones de likes de una publicación vía WebSocket
     * @param {number} publicacionId - ID de la publicación
     * @param {Function} callback - Función callback para manejar actualizaciones
     */
    subscribeToLikes(publicacionId, callback) {
        const topic = `/topic/publicaciones/${publicacionId}/likes`;

        return websocketService.subscribe(topic, (data) => {
            // Actualizar cache
            this.likesCache.set(publicacionId, data.totalLikes);

            // Ejecutar callback con los datos actualizados
            callback(data);
        });
    }

    /**
     * Desuscribirse de actualizaciones de likes
     * @param {number} publicacionId - ID de la publicación
     */
    unsubscribeFromLikes(publicacionId) {
        const topic = `/topic/publicaciones/${publicacionId}/likes`;
        websocketService.unsubscribe(topic);

        // Limpiar cache
        this.likesCache.delete(publicacionId);
    }

    /**
     * Obtener el total de likes desde el cache
     * @param {number} publicacionId - ID de la publicación
     * @returns {number|null}
     */
    getCachedLikes(publicacionId) {
        return this.likesCache.get(publicacionId) || null;
    }

    /**
     * Suscribirse a múltiples publicaciones
     * @param {Array<number>} publicacionIds - Array de IDs de publicaciones
     * @param {Function} callback - Callback que recibe {publicacionId, data}
     */
    subscribeToMultipleLikes(publicacionIds, callback) {
        publicacionIds.forEach(id => {
            this.subscribeToLikes(id, (data) => {
                callback({ publicacionId: id, data });
            });
        });
    }

    /**
     * Limpiar todas las suscripciones y cache
     */
    cleanup() {
        this.likesCache.forEach((_, publicacionId) => {
            this.unsubscribeFromLikes(publicacionId);
        });

        this.likesCache.clear();
        this.userLikes.clear();
    }
}

export const likeService = new LikeService();