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
            const response = await api.get(API.GEO.GET_ALL_PUNTOS_INTERES);
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
            const response = await api.get(API.GEO.GET_PUNTO_INTERES_BY_ID(id));
            return response.data;
        } catch (error) {
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
            const response = await api.post(API.GEO.CREATE_PUNTO_INTERES, data);
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
            const response = await api.put(API.GEO.UPDATE_PUNTO_INTERES(id), data);
            return response.data;
        } catch (error) {
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
            await api.delete(API.GEO.DELETE_PUNTO_INTERES(id));
            return true;
        } catch (error) {
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
                nombre: "Parque Central",
                descripcion: "Parque central de la ciudad",
                imgPun: "https://ejemplo.com/parque.jpg",
                idDireccion: 1,
                direccion: {
                    id: 1,
                    viaPrincipal: "Carrera 10",
                    numeroVia: "45",
                    letraUno: "A",
                    bi: false,
                    cardinalidadUno: "Sur",
                    numeroUno: "12",
                    letraDos: null,
                    cardinalidadDos: null,
                    numeroDos: null,
                    complemento: null,
                    direccionCompleta: "Carrera 10 45A Sur # 12"
                },
                direccionCompleta: "Carrera 10 45A Sur # 12"

            }
        ];
    }
}

export const poiService = new POIService();
