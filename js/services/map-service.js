export class MapService {
    constructor() {
        this.apiKey = '6a7a078ede27470497b05a41bcca3526';
    }

    // para obtener el por defecto del mapa
    getDefaultMapConfig() {
        return {
            center: [4.64179, -74.11686], // Bogotá, Colombia
            zoom: 12,
            tileLayer: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; OpenStreetMap contributors',
            enableLocation: false,
            maxZoom: 18,
        };
    }

    /**
     * Crear icono personalizado para Leaflet
     * @param {string} iconClass - Clase CSS del icono
     * @param {Array} size - Tamaño del icono [width, height]
     * @returns {L.DivIcon} Icono de Leaflet
     */
    createCustomIcon(iconClass, size = [30, 30]) {
        return L.divIcon({
            html: `<i class="${iconClass} icon-punto"></i>`,
            className: '',
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1]],
        });
    }

    async geocodeAddress(address) {
        try {
            const encodedAddress = encodeURIComponent(address);

            const url = `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${this.apiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            const feature = data.features?.[0];

            return {
                lat: feature?.properties?.lat,
                lng: feature?.properties?.lon,
                address
            };
        } catch (error) {
            console.error("Error en geocodeAddress:", error);
            throw error;
        }
    }

    /**
     * Obtener ruta entre varios puntos
     * @param {Array} waypoints - Array de objetos {lat, lng} o arrays [lat, lng]
     * @param {string} mode - Modo de transporte (drive, bicycle, walk, transit)
     * @returns {Promise<Object>} Promesa con el GeoJSON de la ruta
     */
    async getRoute(waypoints, mode = 'drive') {
        if (!waypoints || waypoints.length < 2) {
            console.error("Se requieren al menos 2 wyapoints para calcular una ruta");
            return null;
        }

        // Format waypoints: lat1,lon1|lat2,lon2
        const waypointsString = waypoints.map(p => {
            if (Array.isArray(p)) return `${p[0]},${p[1]}`;
            return `${p.lat},${p.lng}`;
        }).join('|');

        const url = `https://api.geoapify.com/v1/routing?waypoints=${waypointsString}&mode=${mode}&apiKey=${this.apiKey}`;

        const requestOptions = {
            method: 'GET',
        };

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`GeoApify error: ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching route:', error);
            throw error;
        }
    }
}