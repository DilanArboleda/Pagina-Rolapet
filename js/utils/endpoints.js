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