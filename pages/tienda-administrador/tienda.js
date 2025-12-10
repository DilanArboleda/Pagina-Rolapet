import { catalogService } from "../../js/services/catalog-service.js";

// Elementos del DOM
const productosContainer = document.getElementById('product-container');
const serviciosContainer = document.getElementById('services-container');
const catalogosContainer = document.getElementById('catalogos-list');
const searchInput = document.querySelector('.side_bar_search input');
const searchButton = document.querySelector('.side_bar_search button');

// Variables globales
let allProducts = [];
let allServices = [];
let allCatalogos = [];

/**
 * Renderizar un producto
 * Datos del backend: id, idCatalogo, nombre, precio, fechaCreacion, valoración, 
 * disponible, cantidad, tamaño, peso, id_color, id_unidad_peso
 */
function renderProduct(producto) {
    return `
        <div class="col-md-4 col-sm-6 col-xs-12 margin_bottom_30_all">
            <div class="product_list">
                <div class="product_detail_btm product-p">
                    <div class="extra-card">
                        <h4>${producto.nombre}</h4>
                        <p><strong>Precio:</strong> $${producto.precio.toLocaleString('es-CO')}</p>
                        ${producto.tamaño ? `<p><strong>Tamaño:</strong> ${producto.tamaño}</p>` : ''}
                        ${producto.peso ? `<p><strong>Peso:</strong> ${producto.peso} kg</p>` : ''}
                        <p><strong>Disponible:</strong> ${producto.disponible ? 'Sí' : 'No'}</p>
                        <p><strong>Cantidad:</strong> ${producto.cantidad} unidades</p>
                        ${producto.valoracion ? `<p><strong>Valoración:</strong> ${producto.valoracion}/5 </p>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizar un servicio
 * Datos del backend: id, idCatalogo, nombre, precio, fechaCreacion, 
 * valoración, disponible, duracion, horario
 */
function renderService(servicio) {
    return `
        <div class="col-md-4 service_blog margin_bottom_50 service_card_custom">
            <div class="full">
                <div class="service_cont">
                    <h3 class="service_head">${servicio.nombre}</h3>
                    <p><strong>Precio:</strong> $${servicio.precio.toLocaleString('es-CO')}</p>
                    <p><strong>Duración:</strong> ${servicio.duracion}</p>
                    <p><strong>Horario:</strong> ${servicio.horario}</p>
                    <p><strong>Disponible:</strong> ${servicio.disponible ? 'Sí' : 'No'}</p>
                    ${servicio.valoracion ? `<p><strong>Valoración:</strong> ${servicio.valoracion}/5 </p>` : ''}
                    <div class="bt_cont">
                        <a class="btn sqaure_bt" href="#">Obtener Servicio</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizar catálogos en el sidebar
 * Datos del backend: id, nombre, descripcion, idCategoria, idProveedor
 */
function renderCatalogos(catalogos) {
    if (!catalogosContainer || catalogos.length === 0) return;

    catalogosContainer.innerHTML = catalogos.map(catalogo => `
        <li>
            <a href="#" data-catalogo-id="${catalogo.id}" class="catalogo-link">
                <i class="fa fa-angle-right"></i> ${catalogo.nombre}
            </a>
        </li>
    `).join('');

    // Agregar botón para mostrar todo
    catalogosContainer.innerHTML = `
        <li>
            <a href="#" id="show-all-btn" class="catalogo-link">
                <i class="fa fa-th"></i> <strong>Ver Todo</strong>
            </a>
        </li>
    ` + catalogosContainer.innerHTML;

    // Evento para mostrar todo
    const showAllBtn = document.getElementById('show-all-btn');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadProducts();
            loadServices();
            // Remover clase activa de otros
            document.querySelectorAll('.catalogo-link').forEach(link => link.classList.remove('active'));
            showAllBtn.classList.add('active');
        });
    }

    // Agregar eventos a los catálogos
    catalogosContainer.querySelectorAll('a[data-catalogo-id]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const catalogoId = parseInt(link.dataset.catalogoId);

            // Marcar como activo
            document.querySelectorAll('.catalogo-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            filterByCatalogo(catalogoId);
        });
    });
}

/**
 * Cargar y mostrar productos
 */
async function loadProducts(products = null) {
    try {
        const productos = products || await catalogService.getProducts();
        console.log("PRODUCTOS:", productos);
        allProducts = productos;

        if (!productos || productos.length === 0) {
            productosContainer.innerHTML = `
                <div class="col-md-12">
                    <p class="text-center">No se encontraron productos</p>
                </div>
            `;
            return;
        }

        productosContainer.innerHTML = productos.map(producto => renderProduct(producto)).join('');

    } catch (error) {
        console.error('Error al cargar productos:', error);
        productosContainer.innerHTML = `
            <div class="col-md-12">
                <p class="text-center text-danger">Error al cargar los productos</p>
            </div>
        `;
    }
}

/**
 * Cargar y mostrar servicios
 */
async function loadServices(services = null) {
    if (!serviciosContainer) {
        console.log('Contenedor de servicios no encontrado');
        return;
    }

    try {
        const servicios = services || await catalogService.getServices();
        console.log("SERVICIOS:", servicios);
        allServices = servicios;

        if (!servicios || servicios.length === 0) {
            serviciosContainer.innerHTML = `
                <div class="col-md-12">
                    <p class="text-center">No se encontraron servicios</p>
                </div>
            `;
            return;
        }

        serviciosContainer.innerHTML = servicios.map(servicio => renderService(servicio)).join('');

    } catch (error) {
        console.error('Error al cargar servicios:', error);
        serviciosContainer.innerHTML = `
            <div class="col-md-12">
                <p class="text-center text-danger">Error al cargar los servicios</p>
            </div>
        `;
    }
}

/**
 * Cargar catálogos (para mostrar en sidebar)
 */
async function loadCatalogos() {
    try {
        const catalogos = await catalogService.getAllCatalogos();
        console.log("CATÁLOGOS:", catalogos);
        allCatalogos = catalogos;
        renderCatalogos(catalogos);
    } catch (error) {
        console.error('Error al cargar catálogos:', error);
    }
}

/**
 * Buscar productos por nombre
 */
async function searchProducts(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        await loadProducts(allProducts);
        return;
    }

    try {
        const results = await catalogService.searchProducts(searchTerm);

        if (results.length === 0) {
            productosContainer.innerHTML = `
                <div class="col-md-12">
                    <p class="text-center">No se encontraron productos con "${searchTerm}"</p>
                </div>
            `;
            return;
        }

        await loadProducts(results);

    } catch (error) {
        console.error('Error en búsqueda:', error);
    }
}

/**
 * Filtrar productos Y servicios por catálogo (usando idCatalogo)
 */
async function filterByCatalogo(idCatalogo) {
    try {
        // Filtrar productos por catálogo
        const productos = await catalogService.getProductsByCatalogo(idCatalogo);

        // Filtrar servicios por catálogo
        const servicios = await catalogService.getServicesByCatalogo(idCatalogo);

        // Cargar productos filtrados
        if (productos.length === 0) {
            productosContainer.innerHTML = `
                <div class="col-md-12">
                    <p class="text-center">No se encontraron productos en este catálogo</p>
                </div>
            `;
        } else {
            await loadProducts(productos);
        }

        // Cargar servicios filtrados
        if (servicios.length === 0) {
            serviciosContainer.innerHTML = `
                <div class="col-md-12">
                    <p class="text-center">No se encontraron servicios en este catálogo</p>
                </div>
            `;
        } else {
            await loadServices(servicios);
        }

        // Scroll a la sección de productos
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error al filtrar por catálogo:', error);
    }
}

// Eventos de búsqueda
if (searchButton) {
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        searchProducts(searchInput.value);
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchProducts(searchInput.value);
        }
    });
}

/**
 * Inicialización
 */
async function init() {
    console.log('Cargando catálogo...');

    const loader = document.querySelector('.bg_load');
    if (loader) loader.style.display = 'flex';

    try {
        // Cargar los 3 endpoints en paralelo
        await Promise.all([
            loadCatalogos(),   // GET_ALL_CATALOGO
            loadProducts(),    // GET_ALL_PRODUCTOS
            loadServices()     // GET_ALL_SERVICIOS
        ]);
    } catch (error) {
        throw new Error();
    } finally {
        if (loader) {
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}