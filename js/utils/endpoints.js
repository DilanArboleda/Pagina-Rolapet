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
        GET_PUBLICACIONES_BY_FORO: `${URL_BASE}/contenido/api/v1/publicaciones/foro/`,
        GET_PUBLICACIONES_BY_USUARIO: `${URL_BASE}/contenido/api/v1/publicaciones/usuario/`,
        POST_CREAR_PUBLICACION: `${URL_BASE}/contenido/api/v1/publicaciones`,
        PUT_ACTUALIZAR_PUBLICACION: `${URL_BASE}/contenido/api/v1/publicaciones/`, // ESTA NO SIRVE
        DELETE_ELIMINAR_PUBLICACION: `${URL_BASE}/contenido/api/v1/publicaciones/`,//ESTA NO SIRVE
        //comentarios
        GET_COMENTARIOS_BY_PUBLICACION: `${URL_BASE}/contenido/api/v1/comentarios/publicacion/1`,
        POST_CREAR_COMENTARIO: `${URL_BASE}/contenido/api/v1/comentarios`,
        PUT_ACTUALIZAR_COMENTARIO: `${URL_BASE}/contenido/api/v1/comentarios/`, // ESTA NO SIRVE
        DELETE_ELIMINAR_COMENTARIO: `${URL_BASE}/contenido/api/v1/comentarios/`,//ESTA NO SIRVE
    },
    FORO: {
        GET_PUBLICACIONES_BY_FORO: `${URL_BASE}/foro/api/foros`,
        GET_PUBLICACIONES_BY_FORO_ID: `${URL_BASE}/foro/api/foros/`,
    },
    // SIMULATED - Reemplazar cuando el backend esté listo
    POI: {
        GET_ALL: `${URL_BASE}/poi/api/v1/points`,
        GET_BY_ID: (id) => `${URL_BASE}/poi/api/v1/points/${id}`,
        CREATE: `${URL_BASE}/poi/api/v1/points`,
        UPDATE: (id) => `${URL_BASE}/poi/api/v1/points/${id}`,
        DELETE: (id) => `${URL_BASE}/poi/api/v1/points/${id}`,
        UPLOAD_IMAGES: (id) => `${URL_BASE}/poi/api/v1/points/${id}/images`,
    }
};

export default API;