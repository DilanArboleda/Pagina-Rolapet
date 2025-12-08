import { getRoute } from "../../js/services/map-service.js";

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

const proveedorIcon = L.divIcon({
    html: '<i class="fa-solid fa-warehouse icon-proveedor"></i>',
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

const proveedores = [
    { nombre: "Proveedor Llantas", lat: 4.64, lng: -74.12 },
    { nombre: "Proveedor Carros", lat: 4.645, lng: -74.11 },
    { nombre: "Proveedor Motos", lat: 4.65, lng: -74.13 },
];

proveedores.forEach((p) => {
    const marker = L.marker([p.lat, p.lng], { icon: proveedorIcon })
        .addTo(maps)
        .bindPopup(`<b>${p.nombre}</b><br><button id="btn-route-${p.nombre.replace(/\s+/g, '')}" class="btn-route">Ir aquí</button>`);

    marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-route-${p.nombre.replace(/\s+/g, '')}`);
        if (btn) {
            btn.onclick = async () => {
                if (!userLocation) {
                    alert("Aún no tenemos tu ubicación.");
                    return;
                }

                try {
                    const waypoints = [
                        { lat: userLocation.lat, lng: userLocation.lng },
                        { lat: p.lat, lng: p.lng }
                    ];

                    const routeData = await getRoute(waypoints);

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

                        // Ajustar vista para ver toda la ruta
                        maps.fitBounds(currentRouteLayer.getBounds());
                    }
                } catch (e) {
                    console.error("Error calculando ruta", e);
                    alert("No se pudo calcular la ruta.");
                }
            }
        }
    });
});
