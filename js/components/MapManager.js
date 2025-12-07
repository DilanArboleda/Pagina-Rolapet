/**
 * MapManager - Clase para gestionar mapas Leaflet
 */

import { getDefaultMapConfig, createCustomIcon } from '../services/map-service.js';

export class MapManager {
    /**
     * @param {string} containerId - ID del contenedor del mapa
     * @param {Object} options - Opciones de configuración
     * @param {Array<number>} options.center - Coordenadas del centro [lat, lng]
     * @param {number} options.zoom - Nivel de zoom inicial
     * @param {boolean} options.enableLocation - Habilitar geolocalización
     * @param {string} options.tileLayer - URL del tile layer
     * @param {string} options.attribution - Atribución del mapa
     */
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.map = null;
        this.markers = new Map(); // Usar Map para gestionar marcadores por ID
        this.userLocationMarker = null;
        this.userLocationCircle = null;

        const defaultConfig = getDefaultMapConfig();
        this.options = { ...defaultConfig, ...options };

        this.init();
    }

    /**
     * Inicializar el mapa
     */
    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Contenedor de mapa '${this.containerId}' no encontrado`);
            return;
        }

        // Crear mapa
        this.map = L.map(this.containerId).setView(
            this.options.center,
            this.options.zoom
        );

        // Agregar capa de tiles
        L.tileLayer(this.options.tileLayer, {
            attribution: this.options.attribution,
            maxZoom: this.options.maxZoom,
        }).addTo(this.map);

        // Habilitar geolocalización si está configurado
        if (this.options.enableLocation) {
            this.enableUserLocation();
        }
    }

    /**
     * Habilitar geolocalización del usuario
     */
    enableUserLocation() {
        if (!this.map) return;

        this.map.locate({ setView: true, maxZoom: 16 });

        this.map.on('locationfound', (e) => {
            // Remover marcador anterior si existe
            if (this.userLocationMarker) {
                this.map.removeLayer(this.userLocationMarker);
            }
            if (this.userLocationCircle) {
                this.map.removeLayer(this.userLocationCircle);
            }

            // Agregar nuevo marcador
            this.userLocationMarker = L.marker(e.latlng)
                .addTo(this.map)
                .bindPopup('Tu ubicación actual');

            this.userLocationCircle = L.circle(e.latlng, {
                radius: e.accuracy
            }).addTo(this.map);
        });

        this.map.on('locationerror', () => {
            console.warn('No se pudo obtener la ubicación. Verifica que el GPS esté activo.');
        });
    }

    /**
     * Agregar marcador al mapa
     * @param {number} lat - Latitud
     * @param {number} lng - Longitud
     * @param {Object} options - Opciones del marcador
     * @param {string} options.id - ID único del marcador
     * @param {string} options.popup - Contenido del popup
     * @param {L.Icon} options.icon - Icono personalizado
     * @param {Object} options.data - Datos adicionales del marcador
     * @returns {L.Marker} Marcador creado
     */
    addMarker(lat, lng, options = {}) {
        if (!this.map) return null;

        const markerOptions = {};
        if (options.icon) {
            markerOptions.icon = options.icon;
        }

        const marker = L.marker([lat, lng], markerOptions).addTo(this.map);

        if (options.popup) {
            marker.bindPopup(options.popup);
        }

        // Guardar referencia del marcador
        if (options.id) {
            this.markers.set(options.id, {
                marker,
                data: options.data || {}
            });
        }

        return marker;
    }

    /**
     * Remover marcador por ID
     * @param {string} markerId - ID del marcador
     * @returns {boolean} True si se removió correctamente
     */
    removeMarker(markerId) {
        if (!this.map || !this.markers.has(markerId)) return false;

        const markerData = this.markers.get(markerId);
        this.map.removeLayer(markerData.marker);
        this.markers.delete(markerId);
        return true;
    }

    /**
     * Limpiar todos los marcadores
     */
    clearMarkers() {
        if (!this.map) return;

        this.markers.forEach(({ marker }) => {
            this.map.removeLayer(marker);
        });
        this.markers.clear();
    }

    /**
     * Centrar mapa en coordenadas
     * @param {number} lat - Latitud
     * @param {number} lng - Longitud
     * @param {number} zoom - Nivel de zoom (opcional)
     */
    centerOn(lat, lng, zoom = null) {
        if (!this.map) return;

        if (zoom !== null) {
            this.map.setView([lat, lng], zoom);
        } else {
            this.map.setView([lat, lng]);
        }
    }

    /**
     * Obtener ubicación actual del usuario
     * @returns {Promise<Object>} Coordenadas {lat, lng}
     */
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalización no soportada'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Obtener todos los marcadores
     * @returns {Map} Mapa de marcadores
     */
    getMarkers() {
        return this.markers;
    }

    /**
     * Obtener marcador por ID
     * @param {string} markerId - ID del marcador
     * @returns {Object|null} Datos del marcador
     */
    getMarker(markerId) {
        return this.markers.get(markerId) || null;
    }

    /**
     * Obtener instancia del mapa Leaflet
     * @returns {L.Map} Instancia del mapa
     */
    getMap() {
        return this.map;
    }

    /**
     * Destruir el mapa
     */
    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
            this.markers.clear();
        }
    }
}
