/**
 * Catalog Service - Servicio para gestión de Catálogo (Productos, Servicios y Catálogos)
 */

import { api } from '../utils/api-client.js';
import API from '../utils/endpoints.js';

class CatalogService {

    /**
     * Obtener todos los catálogos
     * @returns {Promise<Array>} Lista de catálogos
     */
    async getAllCatalogos() {
        try {
            const response = await api.get(API.CATALOGO.GET_ALL_CATALOGO);
            console.log("Catálogos:", response);
            return response.map(item => ({
                id: item.id,
                nombre: item.nombre,
                descripcion: item.descripcion,
                idCategoria: item.idCategoria,
                idProveedor: item.idProveedor
            }));
        } catch (error) {
            console.error('Error al obtener catálogos:', error);
            return [];
        }
    }

    /**
     * Obtener todos los productos
     * @returns {Promise<Array>} Lista de productos
     */
    async getProducts() {
        try {
            const response = await api.get(API.CATALOGO.GET_ALL_PRODUCTOS);
            console.log("Productos:", response);
            return response.map(item => ({
                id: item.id,
                idCatalogo: item.idCatalogo,
                nombre: item.nombre,
                precio: item.precio,
                fechaCreacion: item.fechaCreacion,
                valoracion: item.valoración,
                disponible: item.disponible,
                cantidad: item.cantidad,
                tamaño: item.tamaño,
                peso: item.peso,
                idColor: item.id_color,
                idUnidadPeso: item.id_unidad_peso
            }));
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    /**
     * Obtener todos los servicios
     * @returns {Promise<Array>} Lista de servicios
     */
    async getServices() {
        try {
            const response = await api.get(API.CATALOGO.GET_ALL_SERVICIOS);
            console.log("Servicios:", response);
            return response.map(item => ({
                id: item.id,
                idCatalogo: item.idCatalogo,
                nombre: item.nombre,
                precio: item.precio,
                fechaCreacion: item.fechaCreacion,
                valoracion: item.valoración,
                disponible: item.disponible,
                duracion: item.duracion,
                horario: item.horario
            }));
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            return [];
        }
    }

    /**
     * Buscar productos por nombre
     * @param {string} searchTerm - Término de búsqueda
     * @returns {Promise<Array>} Productos filtrados
     */
    async searchProducts(searchTerm) {
        try {
            const productos = await this.getProducts();
            const term = searchTerm.toLowerCase();
            return productos.filter(item =>
                item.nombre?.toLowerCase().includes(term)
            );
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return [];
        }
    }

    /**
     * Buscar servicios por nombre
     * @param {string} searchTerm - Término de búsqueda
     * @returns {Promise<Array>} Servicios filtrados
     */
    async searchServices(searchTerm) {
        try {
            const servicios = await this.getServices();
            const term = searchTerm.toLowerCase();
            return servicios.filter(item =>
                item.nombre?.toLowerCase().includes(term)
            );
        } catch (error) {
            console.error('Error al buscar servicios:', error);
            return [];
        }
    }

    /**
     * Filtrar productos por catálogo
     * @param {number} idCatalogo - ID del catálogo
     * @returns {Promise<Array>} Productos filtrados
     */
    async getProductsByCatalogo(idCatalogo) {
        try {
            const productos = await this.getProducts();
            return productos.filter(item => item.idCatalogo === idCatalogo);
        } catch (error) {
            console.error('Error al filtrar productos por catálogo:', error);
            return [];
        }
    }

    /**
     * Filtrar servicios por catálogo
     * @param {number} idCatalogo - ID del catálogo
     * @returns {Promise<Array>} Servicios filtrados
     */
    async getServicesByCatalogo(idCatalogo) {
        try {
            const servicios = await this.getServices();
            return servicios.filter(item => item.idCatalogo === idCatalogo);
        } catch (error) {
            console.error('Error al filtrar servicios por catálogo:', error);
            return [];
        }
    }

    /**
     * Obtener producto por ID
     * @param {number} id - ID del producto
     * @returns {Promise<Object|null>} Producto encontrado
     */
    async getProductById(id) {
        try {
            const productos = await this.getProducts();
            return productos.find(item => item.id === id) || null;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            return null;
        }
    }

    /**
     * Obtener servicio por ID
     * @param {number} id - ID del servicio
     * @returns {Promise<Object|null>} Servicio encontrado
     */
    async getServiceById(id) {
        try {
            const servicios = await this.getServices();
            return servicios.find(item => item.id === id) || null;
        } catch (error) {
            console.error('Error al obtener servicio por ID:', error);
            return null;
        }
    }

    /**
     * Obtener catálogo por ID
     * @param {number} id - ID del catálogo
     * @returns {Promise<Object|null>} Catálogo encontrado
     */
    async getCatalogoById(id) {
        try {
            const catalogos = await this.getAllCatalogos();
            return catalogos.find(item => item.id === id) || null;
        } catch (error) {
            console.error('Error al obtener catálogo por ID:', error);
            return null;
        }
    }
}

export const catalogService = new CatalogService();