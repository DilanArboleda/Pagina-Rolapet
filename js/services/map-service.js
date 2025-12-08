// para obtener el por defecto del mapa
export function getDefaultMapConfig() {
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
 * Crear icono personalizado para Leaflet -- esta chevere asi jaja
 * @param {string} iconClass - Clase CSS del icono (ej: 'fa-solid fa-location-dot')
 * @param {Array} size - Tamaño del icono [width, height]
 * @returns {L.DivIcon} Icono de Leaflet
 */
export function createCustomIcon(iconClass, size = [30, 30]) {
    return L.divIcon({
        html: `<i class="${iconClass} icon-punto"></i>`,
        className: '',
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1]],
    });
}

// segun una direccion genera una localizacion
export async function geocodeAddress(address) {
    // esta debe ser la simulacion general
    console.warn('geocodeAddress es simulado. Implementar con servicio real.');

    // Retornar coordenadas de ejemplo (centro de Bogotá)
    return {
        lat: 4.64179,
        lng: -74.11686,
        address: address,
    };
}

/**
 * Obtener ruta entre varios puntos
 * @param {Array} waypoints - Array de objetos {lat, lng} o arrays [lat, lng]
 * @param {string} mode - Modo de transporte (drive, bicycle, walk, transit)
 * @returns {Promise<Object>} Promesa con el GeoJSON de la ruta
 */
export async function getRoute(waypoints, mode = 'drive') {
    const apiKey = '6a7a078ede27470497b05a41bcca3526';

    if (!waypoints || waypoints.length < 2) {
        console.error("Se requieren al menos 2 wyapoints para calcular una ruta");
        return null;
    }

    // Format waypoints: lat1,lon1|lat2,lon2
    const waypointsString = waypoints.map(p => {
        if (Array.isArray(p)) return `${p[0]},${p[1]}`;
        return `${p.lat},${p.lng}`;
    }).join('|');

    const url = `https://api.geoapify.com/v1/routing?waypoints=${waypointsString}&mode=${mode}&apiKey=${apiKey}`;

    var requestOptions = {
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
