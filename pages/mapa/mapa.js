import { MapService } from "../../js/services/map-service.js";
import { poiService } from "../../js/services/poi-service.js";

const mapService = new MapService();
let maps = L.map("mi_mapa").setView([4.64179, -74.11686], 12);
let userLocation = null;
let currentRouteLayer = null;

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(maps);

maps.locate({ setView: true, maxZoom: 16 });

maps.on("locationfound", function (e) {
    userLocation = e.latlng;
    L.marker(e.latlng).addTo(maps).bindPopup("Tu ubicación actual");
    L.circle(e.latlng, { radius: e.accuracy }).addTo(maps);
});

maps.on("locationerror", function () {
    alert("No se pudo obtener tu ubicación. Activa el GPS.");
});

const poiIcon = mapService.createCustomIcon("fa-solid fa-map-pin", [40, 40]);

const sidebarList = document.getElementById('proveedores_list');

// Función para calcular y mostrar ruta
async function drawRouteTo(lat, lng) {
    if (!userLocation) {
        alert("Aún no tenemos tu ubicación. Por favor espera o activa el GPS.");
        return;
    }

    try {
        const waypoints = [
            { lat: userLocation.lat, lng: userLocation.lng },
            { lat: lat, lng: lng }
        ];

        const routeData = await mapService.getRoute(waypoints);

        if (currentRouteLayer) {
            maps.removeLayer(currentRouteLayer);
        }

        if (routeData && routeData.features) {
            currentRouteLayer = L.geoJSON(routeData, {
                style: {
                    color: 'blue',
                    weight: 5,
                    opacity: 0.7
                }
            }).addTo(maps);

            maps.fitBounds(currentRouteLayer.getBounds());

            // En móvil, hacer scroll al mapa
            if (window.innerWidth <= 768) {
                document.getElementById('mi_mapa').scrollIntoView({ behavior: 'smooth' });
            }
        }
    } catch (e) {
        console.error("Error calculando ruta", e);
        alert("No se pudo calcular la ruta.");
    }
}

// Función para cargar y mostrar los POIs desde el servicio
async function loadPOIs() {
    try {
        // Obtener los POIs del servicio
        const pois = await poiService.getAllPOIs();

        if (!pois || pois.length === 0) {
            console.warn("No se encontraron POIs");
            sidebarList.innerHTML = '<p style="padding:15px; text-align:center; color:#666;">No hay puntos de interés disponibles</p>';
            return;
        }

        // Limpiar el sidebar
        sidebarList.innerHTML = '';

        // Procesar cada POI
        for (let index = 0; index < pois.length; index++) {
            const poi = pois[index];

            // Obtener coordenadas desde la dirección
            let lat, lng;

            if (poi.direccionCompleta) {
                try {
                    // Intentar geocodificar la dirección
                    const geocodeResult = await mapService.geocodeAddress(poi.direccionCompleta);

                    if (geocodeResult && geocodeResult.lat && geocodeResult.lng) {
                        lat = geocodeResult.lat;
                        lng = geocodeResult.lng;
                    } else {
                        console.warn(`No se pudo geocodificar: ${poi.direccionCompleta}`);
                        continue; // Saltar este POI si no se puede geocodificar
                    }
                } catch (error) {
                    console.error(`Error geocodificando ${poi.direccionCompleta}:`, error);
                    continue; // Saltar este POI en caso de error
                }
            } else {
                console.warn(`POI sin dirección: ${poi.nombre}`);
                continue; // Saltar POIs sin dirección
            }

            // 1. Agregar marcador al mapa
            const marker = L.marker([lat, lng], { icon: poiIcon })
                .addTo(maps)
                .bindPopup(`
                    <div style="min-width:200px;">
                        <b style="font-size:1.1rem;">${poi.nombre}</b><br>
                        <p style="margin:8px 0; font-size:0.9rem;">${poi.descripcion || 'Sin descripción'}</p>
                        <p style="margin:5px 0; font-size:0.85rem; color:#666;">
                            <i class="fa-solid fa-location-dot"></i> ${poi.direccionCompleta}
                        </p>
                        ${poi.imgPun ? `<img src="${poi.imgPun}" alt="${poi.nombre}" style="width:100%; max-height:150px; object-fit:cover; margin:8px 0; border-radius:4px;">` : ''}
                        <button id="btn-route-popup-${index}" class="btn-route" style="margin-top:8px; padding:6px 12px; background:#2094f3; color:white; border:none; border-radius:4px; cursor:pointer; width:100%;">
                            <i class="fa-solid fa-route"></i> Ir aquí
                        </button>
                    </div>
                `);

            marker.on('popupopen', () => {
                const btn = document.getElementById(`btn-route-popup-${index}`);
                if (btn) {
                    btn.onclick = () => drawRouteTo(lat, lng);
                }
            });

            // 2. Agregar item al sidebar
            const item = document.createElement('div');
            item.className = 'proveedor-item';
            item.innerHTML = `
                <div style="display:flex; align-items:start; gap:12px;">
                    ${poi.imgPun ? `
                        <img src="${poi.imgPun}" alt="${poi.nombre}" 
                             style="width:60px; height:60px; object-fit:cover; border-radius:8px; flex-shrink:0;">
                    ` : `
                        <div style="width:60px; height:60px; background:#e0e0e0; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <i class="fa-solid fa-map-pin" style="color:#999; font-size:24px;"></i>
                        </div>
                    `}
                    <div style="flex:1;">
                        <h4 style="margin:0 0 5px 0; font-size:1rem;">${poi.nombre}</h4>
                        <p style="font-size:0.85rem; color:#666; margin:0 0 5px 0;">${poi.descripcion || 'Sin descripción'}</p>
                        <p style="font-size:0.8rem; color:#999; margin:0;">
                            <i class="fa-solid fa-location-dot"></i> ${poi.direccionCompleta}
                        </p>
                    </div>
                </div>
                <button class="btn-sidebar-route" style="margin-top:10px; width:100%;">
                    <i class="fa-solid fa-route"></i> Trazar Ruta
                </button>
            `;

            // Al hacer click en el item, centrar mapa en el marcador y abrir popup
            item.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    maps.setView([lat, lng], 15);
                    marker.openPopup();
                }
            });

            // Botón de ruta en el sidebar
            const btnRoute = item.querySelector('.btn-sidebar-route');
            btnRoute.addEventListener('click', () => {
                drawRouteTo(lat, lng);
            });

            sidebarList.appendChild(item);
        }

        console.log(`Se cargaron ${pois.length} POIs en el mapa`);

    } catch (error) {
        console.error("Error al cargar POIs:", error);
        sidebarList.innerHTML = '<p style="padding:15px; text-align:center; color:#d9534f;">Error al cargar los puntos de interés</p>';
    }
}

// Cargar los POIs cuando se cargue la página
loadPOIs();