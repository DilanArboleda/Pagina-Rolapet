import { MapService } from "../../js/services/map-service.js";

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

const proveedorIcon = mapService.createCustomIcon("fa-solid fa-warehouse", [40, 40]);

const proveedores = [
    { nombre: "Proveedor Llantas", lat: 4.64, lng: -74.12, descripcion: "Venta de llantas para todo tipo de vehículos." },
    { nombre: "Proveedor Carros", lat: 4.645, lng: -74.11, descripcion: "Concesionario de carros nuevos y usados." },
    { nombre: "Proveedor Motos", lat: 4.65, lng: -74.13, descripcion: "Repuestos y accesorios para motocicletas." },
];

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

proveedores.forEach((p, index) => {
    // 1. Agregar marcador al mapa
    const marker = L.marker([p.lat, p.lng], { icon: proveedorIcon })
        .addTo(maps)
        .bindPopup(`
            <b>${p.nombre}</b><br>
            ${p.descripcion}<br>
            <button id="btn-route-popup-${index}" class="btn-route" style="margin-top:5px;cursor:pointer;">Ir aquí</button>
        `);

    marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-route-popup-${index}`);
        if (btn) {
            btn.onclick = () => drawRouteTo(p.lat, p.lng);
        }
    });

    // 2. Agregar item al sidebar
    const item = document.createElement('div');
    item.className = 'proveedor-item';
    item.innerHTML = `
        <h4>${p.nombre}</h4>
        <p style="font-size:0.9rem; color:#666;">${p.descripcion}</p>
        <button class="btn-sidebar-route">Trazar Ruta</button>
    `;

    // Al hacer click en el item, centrar mapa en el marcador y abrir popup
    item.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') { // Si no es el boton, solo centrar
            maps.setView([p.lat, p.lng], 15);
            marker.openPopup();
        }
    });

    // Boton de ruta en el sidebar
    const btnRoute = item.querySelector('.btn-sidebar-route');
    btnRoute.addEventListener('click', () => {
        drawRouteTo(p.lat, p.lng);
    });

    sidebarList.appendChild(item);
});
