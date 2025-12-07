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
