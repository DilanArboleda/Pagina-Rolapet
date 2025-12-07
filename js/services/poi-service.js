/**
 * POI Service - Servicio para gestión de Puntos de Interés
 */

import { api } from '../utils/api-client.js';
import API from '../utils/endpoints.js';

class POIService {

    /**
     * Obtener todos los puntos de interés
     * @returns {Promise<Array>} Lista de POIs
     */
    async getAllPOIs() {
        try {
            const response = await api.get(API.POI.GET_ALL);
            return response.data || [];
        } catch (error) {
            console.error('Error al obtener POIs:', error);
            // Retornar datos de ejemplo en caso de error (simulado)
            return this._getMockPOIs();
        }
    }

    /**
     * Obtener POI por ID
     * @param {string|number} id - ID del POI
     * @returns {Promise<Object>} POI
     */
    async getPOIById(id) {
        try {
            const response = await api.get(API.POI.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener POI ${id}:`, error);
            return null;
        }
    }

    /**
     * Crear nuevo POI
     * @param {Object} data - Datos del POI
     * @returns {Promise<Object>} POI creado
     */
    async createPOI(data) {
        try {
            const response = await api.post(API.POI.CREATE, data);
            console.log('POI creado (simulado):', response);
            return response.data;
        } catch (error) {
            console.error('Error al crear POI:', error);
            throw error;
        }
    }

    /**
     * Actualizar POI existente
     * @param {string|number} id - ID del POI
     * @param {Object} data - Datos actualizados
     * @returns {Promise<Object>} POI actualizado
     */
    async updatePOI(id, data) {
        try {
            const response = await api.put(API.POI.UPDATE(id), data);
            console.log('POI actualizado (simulado):', response);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar POI ${id}:`, error);
            throw error;
        }
    }

    /**
     * Eliminar POI
     * @param {string|number} id - ID del POI
     * @returns {Promise<boolean>} True si se eliminó correctamente
     */
    async deletePOI(id) {
        try {
            await api.delete(API.POI.DELETE(id));
            console.log('POI eliminado (simulado):', id);
            return true;
        } catch (error) {
            console.error(`Error al eliminar POI ${id}:`, error);
            return false;
        }
    }

    /**
     * Subir imágenes para un POI
     * @param {string|number} id - ID del POI
     * @param {FileList|Array} files - Archivos a subir
     * @returns {Promise<Object>} Respuesta del servidor
     */
    async uploadPOIImages(id, files) {
        try {
            // En producción, esto debería usar FormData
            console.log('Subiendo imágenes (simulado) para POI:', id, files);

            // Simular respuesta
            return {
                success: true,
                message: 'Imágenes subidas correctamente (simulado)',
                files: Array.from(files).map(f => f.name),
            };
        } catch (error) {
            console.error(`Error al subir imágenes para POI ${id}:`, error);
            throw error;
        }
    }

    /**
     * Datos de ejemplo (mock) para desarrollo
     * @private
     * @returns {Array} POIs de ejemplo
     */
    _getMockPOIs() {
        return [
            {
                id: 1,
                nombre: 'Museo de Arte Moderno',
                descripcion: 'Museo con exposiciones de arte contemporáneo',
                categoria: 'Museo',
                estado: 'Activo',
                direccion: 'Calle 24 #6-00, Bogotá',
                lat: 4.64,
                lng: -74.12,
            },
            {
                id: 2,
                nombre: 'Parque Simón Bolívar',
                descripcion: 'Parque urbano más grande de Bogotá',
                categoria: 'Parque',
                estado: 'Activo',
                direccion: 'Calle 63 #48-00, Bogotá',
                lat: 4.6575,
                lng: -74.0925,
            },
        ];
    }
}

export const poiService = new POIService();
