const URL_BASE = "http://localhost:8888";


const API = {
    AUTH: {
        LOGIN: `${URL_BASE}/auth/api/v1/auth/login`,
        REFRESH: `${URL_BASE}/auth/api/v1/auth/refresh`,
        SIGNIN: `${URL_BASE}/auth/api/v1/auth/sign-in`,
    },
    USER: {
        ME: `${URL_BASE}/usuario/api/v1/jwt/users/me`,
        FIND_BY_ID: `${URL_BASE}/usuario/api/v1/jwt/users/findById`,
        FIND_ALL: `${URL_BASE}/usuario/api/v1/jwt/users`,
    },
    CONTENIDO: {
        GET_PUBLICACIONES: `${URL_BASE}/contenido/api/v1/publicaciones`,
        GET_PUBLICACIONES_BY_FORO: (id) => `${URL_BASE}/contenido/api/v1/publicaciones/foro/${id}`,
        GET_PUBLICACIONES_BY_USUARIO: (id) => `${URL_BASE}/contenido/api/v1/publicaciones/usuario/${id}`,
        POST_CREAR_PUBLICACION: `${URL_BASE}/contenido/api/v1/publicaciones`,
        PUT_ACTUALIZAR_PUBLICACION: `${URL_BASE}/contenido/api/v1/publicaciones/`, // ESTA NO SIRVE
        DELETE_ELIMINAR_PUBLICACION: `${URL_BASE}/contenido/api/v1/publicaciones/`,//ESTA NO SIRVE
        //comentarios
        GET_COMENTARIOS_BY_PUBLICACION: (id) => `${URL_BASE}/contenido/api/v1/comentarios/publicacion/${id}`,
        POST_CREAR_COMENTARIO: `${URL_BASE}/contenido/api/v1/comentarios`,
        PUT_ACTUALIZAR_COMENTARIO: `${URL_BASE}/contenido/api/v1/comentarios/`, // ESTA NO SIRVE
        DELETE_ELIMINAR_COMENTARIO: `${URL_BASE}/contenido/api/v1/comentarios/`,//ESTA NO SIRVE
    },
    FORO: {
        GET_PUBLICACIONES_BY_FORO: `${URL_BASE}/foro/api/foros`,
        GET_PUBLICACIONES_BY_FORO_ID: (id) => `${URL_BASE}/foro/api/foros/${id}`,
    },
    // SIMULATED - Reemplazar cuando el backend esté listo
    POI: {
        GET_ALL: `${URL_BASE}/poi/api/v1/points`,
        GET_BY_ID: (id) => `${URL_BASE}/poi/api/v1/points/${id}`,
        CREATE: `${URL_BASE}/poi/api/v1/points`,
        UPDATE: (id) => `${URL_BASE}/poi/api/v1/points/${id}`,
        DELETE: (id) => `${URL_BASE}/poi/api/v1/points/${id}`,
        UPLOAD_IMAGES: (id) => `${URL_BASE}/poi/api/v1/points/${id}/images`,
    },
    VEHICULO: {
        GET_VEHICULOS_BY_USUARIO_ID: (id) => `${URL_BASE}/vehiculo/api/v1/vehiculos/${id}`,
        POST_CREAR_VEHICULO: `${URL_BASE}/vehiculo/api/v1/vehiculos`,
        PUT_ACTUALIZAR_VEHICULO: `${URL_BASE}/vehiculo/api/v1/vehiculos/`, // ESTA NO SIRVE
        DELETE_ELIMINAR_VEHICULO: `${URL_BASE}/vehiculo/api/v1/vehiculos/`,//ESTA NO SIRVE
    },
};

export default API;