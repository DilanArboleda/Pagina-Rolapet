let maps = L.map("mi_mapa").setView([4.64179, -74.11686], 12);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(maps);

maps.locate({ setView: true, maxZoom: 16 });

maps.on("locationfound", function (e) {
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
    L.marker([p.lat, p.lng], { icon: proveedorIcon })
        .addTo(maps)
        .bindPopup(`<b>${p.nombre}</b>`);
});


// TODO -> hacer la conexion con el backend y mostrar cad auno de los apartados y una ruta :p
